// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Prover} from "vlayer-0.1.0/Prover.sol";
import {Web, WebProof, WebProofLib, WebLib} from "vlayer-0.1.0/WebProof.sol";

contract WebProofProver is Prover {
    using WebProofLib for WebProof;
    using WebLib for Web;

    string public constant ACCOUNT_DATA_URL =
        "https://api.x.com/1.1/account/settings.json?include_ext_sharing_audiospaces_listening_data_with_followers=true&include_mention_filter=true&include_nsfw_user_flag=true&include_nsfw_admin_flag=true&include_ranked_timeline=true&include_alt_text_compose=true&ext=ssoConnections&include_country_code=true&include_ext_dm_nsfw_media_filter=true";

    string public constant FOLLOWERS_COUNT_DATA_URL =
        "https://x.com/i/api/graphql/xWw45l6nX7DP2FKRyePXSw/UserByScreenName?variables=%7B%22screen_name%22%3A%22";

    function accountProof(WebProof calldata webProof, address account)
        public
        view
        returns (Proof memory, string memory, address)
    {
        Web memory web = webProof.verify(ACCOUNT_DATA_URL);
        string memory screenName = web.jsonGetString("screen_name");
        return (proof(), screenName, account);
    }

    function followersProof(
        WebProof calldata webProof, 
        address account
    )
        public
        view
        returns (Proof memory, int256, address)
    {
        Web memory web = webProof.verifyWithUrlPrefix(FOLLOWERS_COUNT_DATA_URL);
        int256 followersCount = web.jsonGetInt("data.user.result.legacy.followers_count");
        return (proof(), followersCount, account);
    }
}
