import { useQueryClient } from "react-query";
import ProfileForm from "./Profile/ProfileForm"
import { QueryProfile } from "../hooks/profile";

function Profile(){
    const queryClient = useQueryClient();
    const {data, status} = QueryProfile(1)
    return (
        <main className="flex-vertical">
            <h1>Profile</h1>
            <ProfileForm
            values = {data}
            />
        </main>
    )
}
export default Profile