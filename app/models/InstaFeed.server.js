
import db from "../db.server";

export async function getInstafeed(shop, graphql) {
  const InstaFeed = await db.instaFeed.findFirst({ where: { shop } });

  if (!InstaFeed) {
    return null;
  }

  return supplementInstafeed(InstaFeed, graphql);
}
export async function getId(shop) {
  const data= await db.instaFeed.findFirst({ where: { shop } });
  return data;
}

export async function getinstafeed(shop) {
  const InstaFeed = await db.instaFeed.findMany({
    where: { shop },
    orderBy: { id: "desc" },
  });

  if (!InstaFeed.length) {
    return InstaFeed;
  }

  return Promise.all(
    InstaFeed.map(async (InstaFeed) => supplementInstafeed(InstaFeed))
  );
}

export async function getInstafeedImage(id) {
  const { origin } = new URL(process.env.SHOPIFY_APP_URL);

 // const image = await qrcode.toBuffer(`${origin}/qrcodes/${id}/scan`);

 // return `data:image/jpeg;base64, ${image.toString("base64")}`;
}

export function getDestinationUrl(InstaFeed) {
  if (InstaFeed.destination === "product") {
    return `https://${InstaFeed.shop}/products/${InstaFeed.productHandle}`;
  }

  const id = InstaFeed.productVariantId.replace(
    /gid:\/\/shopify\/ProductVariant\/([0-9]+)/,
    "$1"
  );

  return `https://${InstaFeed.shop}/cart/${id}:1`;
}

async function supplementInstafeed(InstaFeed, graphql) {
  return {
    ...InstaFeed,
    id:parseInt(InstaFeed?.id),
    instaUsername: (InstaFeed.instaUsername),
    instaTitle: (InstaFeed.instaTitle),
    instaSelectItems: (InstaFeed.instaSelectItems),
    instaSelectPosts: (InstaFeed.instaSelectPosts),
    instCheckedImageIds: (InstaFeed.instCheckedImageIds),
  };
}


export function validateInstafeed(data) {
  const errors = {};

  if (!data.instaTitle) {
    errors.instaTitle = "instaTitle is required";
  }

  if (!data.instaUsername) {
    errors.instaUsername = "instaUsername is required";
  }

  if (!data.instaSelectItems) {
    errors.instaSelectItems = "instaSelectItems is required";
  }

  if (!data.instaSelectPosts) {
    errors.instaSelectPosts = "instaSelectPosts is required";
  }
  if (!data.instCheckedImageIds) {
    errors.instCheckedImageIds = "instCheckedImageIds is required";
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}
