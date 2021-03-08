import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import RowProfile from "../../Components/Search/RowProfile";
import { Wrapper1, Wrapper2 } from "../../Components/Search/wrappers";
import { UserState } from "../../States/User";
import { getUser } from "../../Api/users";

export default function MyProfile() {
  const { UState } = useContext(UserState);
  const [profile, setProfile] = useState(null);

  useEffect(async () => {
    const data = await getUser(UState.user.public_user.id);
    setProfile(data);
  }, []);

  return (
    <>
      <Head>
        <title>Mi perfil</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Wrapper1>
        <Wrapper2>
          <RowProfile profile={profile} />
        </Wrapper2>
      </Wrapper1>
    </>
  );
}
