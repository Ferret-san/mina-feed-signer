const Koa = require("koa");
const Router = require("@koa/router");
const { isReady, PrivateKey, Field, Signature } = require("snarkyjs");

const PORT = process.env.PORT || 3000;

const app = new Koa();
const router = new Router();

async function getETHUSD() {
  // We need to wait for SnarkyJS to finish loading before we can do anything
  await isReady;

  // The private key of our account. When running locally the hardcoded key will
  // be used. In production the key will be loaded from a Vercel environment
  // variable.
  const privateKey = PrivateKey.fromBase58(
    process.env.PRIVATE_KEY ??
    "EKF65JKw9Q1XWLDZyZNGysBbYG21QbJf3a4xnEoZPZ28LKYGMw53"
  );

  // We fetch the price for the asset of choice (ETH in this case)
  const priceUrl =
    'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD';
  const pricePath = 'RAW.ETH.USD.PRICE';
  const timePath = 'RAW.ETH.USD.PRICE';
  const response = await fetch(priceUrl);
  const data = await response.json();
  const priceResult = JSONPath({ path: pricePath, json: data });
  console.log("priceResult", priceResult);
  const r100 = Math.floor((priceResult[0] * 100));
  console.log("r100", r100);
  const timeResult = JSONPath({ path: timePath, json: data })
  console.log("timeResult", timeResult);
  // We compute the public key associated with our private key
  const publicKey = privateKey.toPublicKey();

  // Define a Field for the price
  const price = Field(r100);
  // Define a Field for the time when the price was last updated
  const time = Field(timeResult)

  // Use our private key to sign an array of Fields containing the users id and
  // credit score
  const signature = Signature.create(privateKey, [id, creditScore]);

  return {
    data: { price: price, time: time },
    signature: signature,
    publicKey: publicKey,
  };
}

router.get("/price", async () => {
  ctx.body = await getETHUSD();
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT);
