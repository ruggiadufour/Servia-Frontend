import { useContext, useEffect, useState } from "react";
import RowProfile from "../../Components/Search/RowProfile";
import { Wrapper1, Wrapper2 } from "../../Components/Search/wrappers";
import { UserState } from "../../States/User";
import {getUser} from '../../Api/users'

export default function MyProfile() {
  const { UState } = useContext(UserState);
  const [profile, setProfile] = useState(null)

  useEffect(async () => {
    const data = await getUser(UState.user.public_user.id)
    console.log(UState)
    setProfile(data)
  }, [])

  return (
    <Wrapper1>
      <Wrapper2>
        <RowProfile profile={profile} />
      </Wrapper2>
    </Wrapper1>
  );
}
