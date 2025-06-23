import { postApi } from './common';

export const generateApiToken = async (authToken, mygroup, myregion, myrole) => {
  const response = await postApi('auth/generateApiToken', {
    accessToken: authToken,   //can be either access_token or id_token based on availability
    myGroup: mygroup,
    myRegion: myregion,
    myRole: myrole
  });
  return response;
};
