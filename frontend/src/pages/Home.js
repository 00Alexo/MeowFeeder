import { useAuthContext } from "../hooks/useAuthContext";
import Dashboard from "./Dashboard";
import WelcomePage from "./WelcomePage";

const Home = () => {
    const { user } = useAuthContext();

    if(!user)
        return(
            <WelcomePage/>
        )

    if(user)
        return (
        <Dashboard/>
    );
}
 
export default Home;