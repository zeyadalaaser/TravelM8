import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';

const useRouter = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    return {
        searchParams,
        navigate,
        location,
    };
};

export default useRouter;
