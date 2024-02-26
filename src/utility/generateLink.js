const axios = require("axios");

const generateLink = (userId,type="referBy") => {
  const data = JSON.stringify({
    dynamicLinkInfo: {
      domainUriPrefix: "https://test.page.link",
      link: type=="referBy" ? `https://www.test.com/refer?referBy=${userId}` : `https://www.test.com/sellerInfo?sellerId=${userId}`,
      androidInfo: {
        androidPackageName: "com.test.test",
      },
      iosInfo: {
        iosBundleId: "com.example.ios",
      },
    },
    suffix: {
        option: "SHORT"
      }
  });

  const config = {
    method: "post",
    url: "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyAOyU3DT7aUAcONcfJmR0BPWlaBOjerXy4",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  const getLink = new Promise((resolve, reject) => {
    const res = axios(config)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
    return res;
  });

  return { getLink };
};

module.exports = generateLink;