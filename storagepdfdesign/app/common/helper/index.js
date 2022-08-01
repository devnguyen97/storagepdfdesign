
import CodePush from 'react-native-code-push';
import I18n from "./I18n";


const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const translate = (key) => {
    return I18n.t(key)
}

// Return Boolean
export function IsValidateObject(object) {
    return object !== undefined && object !== null;
}

export function generateUUID(digits) {
    const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ';
    const uuid = [];
    for (let i = 0; i < digits; i++) {
        uuid.push(str[Math.floor(Math.random() * str.length)]);
    }
    return uuid.join('');
}

// Return Boolean
export const hasProperty = (object, property) => {
    return (
        IsValidateObject(object) &&
        Object.hasOwnProperty.call(object, property) &&
        IsValidateObject(object[property])
    );
};

export const convert_month = function (data) {
    const _date = new Date(data);
    let day = _date.getDate();
    let year = _date.getFullYear();

    if (day < 10) {
        day = `0${day}`;
    }

    return `${day}/${_date.getMonth()}/${year}`;
};


export const getPathImageIOS = (assetPath) => {
    return new Promise(async (resolve, reject) => {
        if (!assetPath.includes('ph://')) {
            resolve(assetPath);
        }
        const dest = `${RNFS.TemporaryDirectoryPath}${Math.random()
            .toString(36)
            .substring(7)}.jpg`;
        try {
            const absolutePath = await RNFS.copyAssetsFileIOS(
                assetPath,
                dest,
                0,
                0
            );
            resolve(absolutePath);
        } catch (error) {
            reject(error);
        }
    });
};

export function cloneArray(arr) {
    const arrStr = JSON.stringify(arr);
    return JSON.parse(arrStr);
}


export const randomString = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

export const syncUpdateApp = (downloadProgress) => {
    return new Promise((resolve, reject) => {
        CodePush.disallowRestart();
        CodePush.sync(
            {
                installMode: CodePush.InstallMode.ON_NEXT_RESTART
            },
            (syncStatus) => {
                if (
                    syncStatus === CodePush.SyncStatus.UPDATE_INSTALLED ||
                    syncStatus === CodePush.SyncStatus.UP_TO_DATE
                ) {
                    CodePush.notifyAppReady();
                    resolve();
                }
                if (syncStatus === CodePush.SyncStatus.UNKNOWN_ERROR) {
                    reject();
                }
            },
            (progress) => {
                const { receivedBytes, totalBytes } = progress;
                const temp = receivedBytes / totalBytes;
                downloadProgress(temp.toFixed(1));
            }
        );
    });
};

export const checkVersionUpdate = (
    downloadProgress = () => {},
    updateResult
) => {
    return new Promise(async (resolve, reject) => {
        time = setTimeout(() => {
            clearTimeout(time);
            resolve();
        }, 10000);
        try {
            CodePush.checkForUpdate()
                .then(async (update) => {
                    if (update) {
                        if (
                            hasProperty(update, 'failedInstall') &&
                            update.failedInstall
                        ) {
                            CodePush.clearUpdates();
                        }
                        if (update.isMandatory) {
                            await syncUpdateApp(downloadProgress);
                            setTimeout(() => {
                                CodePush.allowRestart();
                                resolve();
                            }, 1000);
                        } else {
                            resolve();
                            await syncUpdateApp(downloadProgress);
                        }
                        clearTimeout(time);
                        return;
                    }
                    clearTimeout(time);
                    resolve();
                })
                .catch((err) => {
                    clearTimeout(time);
                    resolve();
                });
        } catch (error) {
            clearTimeout(time);
            resolve();
        }
    });
};

export const currencyForma = (num) =>  {
    return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
 }

 export function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');

    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
    str = str.replace(/\u02C6|\u0306|\u031B/g, ''); 
    str = str.replace(/ + /g, ' ');
    str = str.trim();
    str = str.replace(
        /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
        ' '
    );
    return str;
}