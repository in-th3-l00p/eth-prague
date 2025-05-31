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

    string public constant FOLLOWERS_COUNT_DATA_URL1 =
        "https://x.com/i/api/graphql/xWw45l6nX7DP2FKRyePXSw/UserByScreenName?variables=%7B%22screen_name%22%3A%22";

    string public constant FOLLOWERS_COUNT_DATA_URL2 =
        "%22%7D&features=%7B%22hidden_profile_subscriptions_enabled%22%3Atrue%2C%22profile_label_improvements_pcf_label_in_post_enabled%22%3Atrue%2C%22rweb_tipjar_consumption_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22subscriptions_verification_info_is_identity_verified_enabled%22%3Atrue%2C%22subscriptions_verification_info_verified_since_enabled%22%3Atrue%2C%22highlights_tweets_tab_ui_enabled%22%3Atrue%2C%22responsive_web_twitter_article_notes_tab_enabled%22%3Atrue%2C%22subscriptions_feature_can_gift_premium%22%3Atrue%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%7D&fieldToggles=%7B%22withAuxiliaryUserLabels%22%3Atrue%7D";

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
        address account,
        string memory screenName
    )
        public
        view
        returns (Proof memory, int256, address)
    {
        Web memory web = webProof.verify(
            string.concat(
                FOLLOWERS_COUNT_DATA_URL1,
                screenName,
                FOLLOWERS_COUNT_DATA_URL2
            )
        );
        int256 followersCount = web.jsonGetInt("data.user.result.legacy.followers_count");
        return (proof(), followersCount, account);
    }
}
