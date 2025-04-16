
import { Navigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore"

const ProtectedRoute = ({ children }: any) => {
    debugger;
    const isLoggedIn = useUserStore(state => state.isLoggedIn)
    return (isLoggedIn ? children : <Navigate to="/login/callback" replace />)

};
export default ProtectedRoute;