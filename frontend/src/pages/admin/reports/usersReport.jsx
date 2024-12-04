import React, { useState, useMemo, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import axios from "axios";

const chartConfig = {
  admins: {
    label: "Admins",
    color: "#FFAF45",
  },
  tourismGovernors: {
    label: "Tourism Governors",
    color: "#FB6D48",
  },
  advertisers: {
    label: "Advertisers",
    color: "#D74B76",
  },
  tourists: {
    label: "Tourists",
    color: "#673F69",
  },
  sellers: {
    label: "Sellers",
    color: "#4C7EA3",
  },
  tourGuides: {
    label: "Tour Guides",
    color: "#A5B68D",
  },
};

const UsersReport = () => {
  const [chartData, setChartData] = useState([]);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [targetMonth, setTargetMonth] = useState(null);
  const [targetYear, setTargetYear] = useState(null);
  const [allData, setAllData] = useState({});
  const [systemUsersCount, setSystemUsersCount] = useState(0);
  const [isAllUsers, setisAllUSers] = useState(true);

  function filterData() {
    console.log("hi from filter data");
    setisAllUSers(false);

    const today = new Date();
    const currentMonth = today.getMonth() + 1; // JS months are 0-based
    const currentYear = today.getFullYear();

    let data;

    console.log("target month: ", targetMonth);
    console.log("target year: ", targetYear);

    if (targetMonth || targetYear) {
      data = Object.entries(allData)
        .map(([key, value]) => {
          const filtered = value?.filter((item) => {
            const effectiveMonth = targetMonth || currentMonth;
            const effectiveYear = targetYear || currentYear;
            setTargetMonth(effectiveMonth);
            setTargetYear(effectiveYear);
            return (
              item.month == parseInt(effectiveMonth, 10) &&
              item.year == parseInt(effectiveYear, 10)
            );
          });

          const filteredCount =
            filtered?.reduce((acc, item) => acc + item.usersCount, 0) || 0;

          return {
            category: chartConfig[key]?.label || key,
            count: filteredCount,
            fill: chartConfig[key]?.color,
          };
        })
        .filter((item) => item.count > 0);
    } else {
      // Case where both are null or empty
      setisAllUSers(true);
      data = Object.entries(allData)
        .map(([key, value]) => {
          const totalUsersCount = value.reduce(
            (acc, dataOfDate) => acc + dataOfDate.usersCount,
            0
          );

          return {
            category: chartConfig[key]?.label || key,
            count: totalUsersCount,
            fill: chartConfig[key]?.color,
          };
        })
        .filter((item) => item.count > 0);
    }

    console.log("Processed data: ", data);
    setChartData(data);
    setTotalVisitors(data.reduce((acc, curr) => acc + curr.count, 0));
  }

  function getTotalSystemUsers() {
    const temp = Object.entries(allData)
      .map(
        ([key, value]) =>
          value
            .map((item) => item.usersCount)
            .reduce((acc, curr) => acc + curr, 0) // Provide 0 as the initial value for reduce
      )
      .reduce((acc, curr) => acc + curr, 0); // Provide 0 as the initial value for the outer reduce

    console.log(temp);
    setSystemUsersCount(temp);
  }

  async function fetchData() {
    try {
      const response = await axios.get("http://localhost:5001/api/usersReport");

      const tempData = response?.data?.data || {};
      // const targetMonth = 10;
      setAllData(tempData);
    } catch (error) {
      throw new Error("Faile to fetch data");
    }
  }

  function getMonthName(monthNumber) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Check if the input is valid
    if (monthNumber < 1 || monthNumber > 12) {
      return "Invalid month number";
    }

    // Convert month number to array index and return the name
    return monthNames[monthNumber - 1];
  }

  useEffect(() => {
    fetchData();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (allData) {
      console.log(allData);
      filterData();
      getTotalSystemUsers();
      console.log("all users" + systemUsersCount);
    }
  }, [allData]);

  useEffect(() => {
    filterData();
  }, [targetMonth, targetYear]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  console.log(chartData);
  console.log("total users = " + totalVisitors);

  return (
<Card className="w-full flex flex-col">
  <CardHeader className="flex flex-col gap-5 space-y-0 pb-0">
    <div className="flex justify-between">
      <div className="grid gap-1">
        <CardTitle>Users</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {isAllUsers
            ? "All"
            : `${getMonthName(targetMonth)} - ${targetYear}`}
        </CardDescription>
      </div>
      <CustomSelect
        month={targetMonth}
        year={targetYear}
        startYear={2023}
        endYear={2024}
        setMonth={setTargetMonth}
        setYear={setTargetYear}
      />
    </div>
    <Button
      className="hover:bg-transparent self-end mt-0 pr-0 mr-0"
      variant="ghost"
      onClick={() => {
        setTargetMonth(null);
        setTargetYear(null);
      }}
    >
      <span className="underline">
        Clear Filters
      </span>
    </Button>
  </CardHeader>


      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          {totalVisitors > 0 ? (
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="category"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            {isAllUsers ? "Total Users" : "New Users"}
                          </tspan>
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </Pie>
            </PieChart>
          ) : (
            // Fallback text when there is no chart data (i.e., no pie chart)
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-lg font-bold">
                <div className="text-3xl font-bold">{0}</div>
                <div className="text-muted-foreground">New Users</div>
              </div>
            </div>
          )}
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-4 text-sm m-5">
        <div className="leading-none font-semibold text-lg">
          {isAllUsers
            ? "Showing data for all users"
            : `Showing data for ${getMonthName(targetMonth)} - ${targetYear}`}
        </div>
        <div className="leading-none font-semibold text-muted-foreground ">
          Total number of users on the system is {systemUsersCount}
        </div>
      </CardFooter>
    </Card>
  );
}

const CustomSelect = ({
  month,
  year,
  startYear,
  endYear,
  setYear,
  setMonth,
}) => {
  console.log(month);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  const getMonthNumber = (monthName) => {
    const months = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    const monthNumber = months[monthName];
    if (monthNumber) {
      return monthNumber;
    }
  };

  console.log(month);
  return (
    <div className="flex gap-3">
      <Select
        value={month ?? ""}
        onValueChange={(value) =>
          value === "" ? setMonth(null) : setMonth(value)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a Month" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {months.map((month, index) => (
              <SelectItem key={index} value={getMonthNumber(month)}>
                {month}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={year ?? ""}
        onValueChange={(value) =>
          value === "" ? setYear(null) : setYear(value)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UsersReport;
