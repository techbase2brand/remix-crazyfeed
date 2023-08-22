import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";

import db from "../db.server";
import { getInstafeedImage } from "~/models/InstaFeed.server";

export const loader = async ({ params }) => {
  invariant(params.id, "Could not find QR code destination");

  const id = Number(params.id);
  const qrCode = await db.instaFeed.findFirst({ where: { id } });

  invariant(qrCode, "Could not find QR code destination");

  return json({
    title: qrCode.title,
    image: await getInstafeedImage(id),
  });
};

export default function InstaFeed() {
  const { image, title } = useLoaderData();

  return (
    <>
      <h1>{title}</h1>
      <img src={image} alt={`QR Code for product`} />
    </>
  );
}