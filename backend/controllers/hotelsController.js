import axios from "axios";

let hotelsToken;
const globalCookieMap = new Map();

function extractCookies(cookieArray) {
    cookieArray.forEach(cookie => {
        const [name, value] = cookie.split(';')[0].split('=');
        if (value === '')
            return;
        globalCookieMap.set(name, value);
    });
}

function combineCookies() {
    return Array.from(globalCookieMap)
        .map(([name, value]) => `${name}=${value}`)
        .join('; ');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getToken() {
    console.log("hi token");

    while (!hotelsToken) {
        let response = null;
        try {
            response = await axios.get('https://www.hotelscombined.com/');
            extractCookies(response.headers["set-cookie"]);
        } catch {
            console.log("token error?????");
        }

        console.log("done fetching token");
        const regex = /"formtoken":"([^"]+)"/;
        const match = response.data.match(regex);

        if (match)
            hotelsToken = match[1];
        else
            await sleep(300);
    }

    return hotelsToken;
}

export const getHotelsToken = async (_, res) => {
    try {
        res.status(200).send(await getToken());
    } catch (error) {
        res.status(error.response?.status || 500).send('Error getting token');
    }
};

export const getHotels = async (req, res) => {
    let token;

    const requestBody = req.body;

    let response = null;

    do {
        try {
            if (!token)
                token = await getToken();
            
            response = await axios.post(
                "https://www.hotelscombined.com/i/api/search/dynamic/hotels/poll",
                requestBody,
                {
                    headers: {
                        "X-CSRF": token,
                        "Content-Type": "application/json",
                        "Referer": "https://www.hotelscombined.com",
                        "Origin": "https://www.hotelscombined.com",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
                        "X-Requested-With": "XMLHttpRequest",
                        "Cookie": combineCookies()
                    },
                }
            );
            
        }
        catch (error) {
            const errorStr = JSON.stringify(error?.response?.data);
            console.log(errorStr);
            if (errorStr?.includes("Session is invalid or expired"))
            {
                token = null;
                hotelsToken = null;
            }
            if (errorStr?.includes("The checkOutDate must be after the checkInDate"))
            {
                res.status(200).send([]);
                return;
            }
            if (errorStr?.includes("The user has sent too many requests in a given amount of time")) {
                res.sendStatus(204);
                return;
            }
        }
        console.log(response?.data?.results?.length);
        await sleep(600);
    }
    while (!response || (response.data?.results?.length < 20 && response.data?.status !== "complete"));

    console.log("done");

    res.status(200).send(response?.data.results.filter(result => result.resultType === "core"));
};