import { useEffect, useState } from "react";
import { json, redirect } from "@remix-run/node";
import axios from "axios";
import { cors } from "remix-utils";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
  useNavigate,
} from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
  LegacyCard,
  Select,
  Form,
  Button,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import { ImageMajor } from "@shopify/polaris-icons";

import db from "../db.server";
import {
  getInstafeed,
  validateInstafeed,
  getId,
} from "../models/InstaFeed.server";
import InstafeedPopup from "./Components/InstafeedPopup";

export async function loader({ request, params }) {
  const { admin, session } = await authenticate.admin(request);
  const { shop } = session;
  const editData = db.instaFeed.findFirst({ where: { shop } });
  if (params?.id === "new") {
    return json({
      destination: "product",
      title: "",
      editData: editData,
    });
  }

  return json(await getInstafeed(shop, admin.graphql));
}

export async function action({ request, params }) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  if (request.method === "DELETE") {
    await db.instaFeed.delete({ where: { id: Number(params?.id) } });
    return redirect("/app");
  }

  /** @type {any} */
  const data = {
    ...Object.fromEntries(await request.formData()),
    shop,
  };

  const errors = validateInstafeed(data);

  if (errors) {
    return json({ errors }, { status: 422 });
  }
  //
  const newData = await getId(shop);
  data.instaTitle = data.instaTitle;
  data.instaUsername = data.instaUsername;
  data.instaSelectItems = data.instaSelectItems;
  data.instaSelectPosts = data.instaSelectPosts;
  const InstaFeed = newData?.id
    ? await db.instaFeed.update({ where: { id: newData?.id }, data })
    : await db.instaFeed.create({ data });
  return InstaFeed;
}

export default function QRCodeForm() {
  // insta form states starts
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [selectItems, setSelectItems] = useState("");
  const [selectPosts, setSelectPosts] = useState("");
  const [formPreFill, setformPreFill] = useState("");
  const [notification, setNotification] = useState(false);
  const [errorNotification, setErrorNotification] = useState(false);
  const [activePopup, setActivePopup] = useState(false);
  const [instaData, setInstaData] = useState([]);
  const [instaUsername, setInstaUsername] = useState([]);
  const [preFilledCheckedPosts, setPreFilledCheckedPosts] = useState([]);
  const [checkedValues, setCheckedValues] = useState([]);
  // insta form states ends

  const [isMobile, setIsMobile] = useState(false);
  const errors = useActionData()?.errors || {};

  const InstaFeed = useLoaderData();
  const [formState, setFormState] = useState(InstaFeed);
  const [cleanFormState, setCleanFormState] = useState(InstaFeed);
  const isDirty = JSON.stringify(formState) !== JSON.stringify(cleanFormState);

  const nav = useNavigation();
  const isSaving = nav.state === "submitting" && nav.formMethod === "POST";
  const isDeleting = nav.state === "submitting" && nav.formMethod === "DELETE";
  const navigate = useNavigate();

  // select options
  const instaRowItems = [
    { label: "0", value: "0" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
  ];
  const instaPosts = [
    { label: "0", value: "0" },
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "30", value: "30" },
    { label: "40", value: "40" },
  ];

  // realtime instaPosts
  const handleSelectPosts = async () => {
    const accessToken =
      "EAAOqIm0DdnIBO0MkOS87Qty82f9KyEj8TZCaCuAHzMNOTV9alaQJ4LhfLQpia7WHoxJIIxkLNSWcVkuZAhZB8YSiHYScYvNokatRs6VlhcF7ZBIikJNZCCV3GRe0upEzPoBgcK12aiKmjVWV7jBIl2gnyjoYIKF2oX4ptEzvAeJftZAWgzWGhZAfKBhYzjAOZBEjJ8vmUhHhskRt3OihzZACvKJXTM2gZD";
    const instagramAccountId = "17841444577460986";
    let endpoint = `https://graph.facebook.com/v12.0/${instagramAccountId}`;
    let url = `${endpoint}?fields=business_discovery.username(${username}){username,website,name,ig_id,id,profile_picture_url,biography,follows_count,followers_count,media_count,media{id,caption,like_count,comments_count,timestamp,username,media_product_type,media_type,owner,permalink,media_url,children{media_url}}}&access_token=${accessToken}`;
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        setInstaData(response.data);
        setInstaUsername(response.data?.business_discovery?.username)
        console.log(instaData, "instaDataaaaaaaaaaaaaaaaaaaaaaa");
      }
    } catch (error) {
      console.log(error, "data not found");
      alert("user not exist for instgram");
      return false;
    }
    
    if (instaUsername) {
      setActivePopup(true);
    }
  };

  // onload prefilled data
  useEffect(() => {
    if (InstaFeed) {
      setUsername(InstaFeed.instaUsername || "");
      setTitle(InstaFeed.instaTitle || "");
      setSelectItems(InstaFeed.instaSelectItems || "");
      setSelectPosts(InstaFeed.instaSelectPosts || "");
      setPreFilledCheckedPosts(InstaFeed.instCheckedImageIds || []);
    } else {
      setUsername("");
      setTitle("");
      setSelectItems("");
      setSelectPosts("");
      setPreFilledCheckedPosts([]);
    }
    // console.log(InstaFeed, "InstaFeed dataaaa");
  }, []);

  const instaFormData = {
    username,
    title,
    selectItems,
    selectPosts,
  };

  // handle submit
  const submit = useSubmit();
  async function handleSave() {
    const instCheckedImageIds = JSON.stringify(checkedValues);
    const data = {
      instaUsername: instaFormData.username || "",
      instaTitle: instaFormData.title || "",
      instaSelectItems: instaFormData.selectItems || "",
      instaSelectPosts: instaFormData.selectPosts || "",
      instCheckedImageIds: instCheckedImageIds || "",
    };

    if (
      username === "" ||
      title === "" ||
      selectItems === "0" ||
      selectPosts === "0"
    ) {
      setErrorNotification(true);
      setTimeout(() => {
        setErrorNotification(false);
      }, 5000);

      return false;
    } else {
      setErrorNotification(false);
      setNotification(true);
      setTimeout(() => {
        setNotification(false);
      }, 5000);
    }
    setCleanFormState({ ...formState });
    submit(data, { method: "post" });
  }

  return (
    <>
      {activePopup && (
        <InstafeedPopup
          instaData={instaData}
          activePopup={activePopup}
          setActivePopup={setActivePopup}
          // setSentValues={setSentValues}
          // sentValues={sentValues}
          preFilledCheckedPosts={preFilledCheckedPosts}
          checkedValues={checkedValues}
          setCheckedValues={setCheckedValues}
        />
      )}
      <Page narrowWidth>
        {errorNotification && (
          <div
            style={{
              background: "#DEF5F7",
              textAlign: "center",
              color: "#839eb6",
              padding: "20px",
              marginBottom: "1rem",
              border: "1px solid red",
              borderRadius: "8px",
            }}
          >
            <Text variant="headingMd" as="h5">
              Data should not be empty or zero (0)
            </Text>
          </div>
        )}
        {notification && (
          <div
            style={{
              background: "#DEF5F7",
              textAlign: "center",
              color: "#839eb6",
              padding: "20px",
              marginBottom: "1rem",
              border: "1px solid #6dd3de",
              borderRadius: "8px",
            }}
          >
            <Text variant="headingMd" as="h5">
              Data has saved successfully
            </Text>
          </div>
        )}
        <div className="insta-form-os" style={{ paddingBottom: "1.5rem" }}>
          <LegacyCard sectioned>
            <Form onSubmit={handleSave}>
              <div style={{ paddingBottom: "1rem" }}>
                <Text variant="headingMd" as="h5">
                  Instagram Business Username
                </Text>
                <TextField
                  label=""
                  type="text"
                  autoComplete=""
                  placeholder="Username"
                  // value=""
                  value={username}
                  onChange={(value) => {
                    setUsername(value);
                  }}
                />
              </div>

              <div style={{ paddingBottom: "1rem" }}>
                <Text variant="headingMd" as="h5">
                  Title
                </Text>
                <TextField
                  label=""
                  type="text"
                  placeholder="Title"
                  autoComplete=""
                  // value=""
                  value={title}
                  onChange={(value) => {
                    setTitle(value);
                  }}
                />
              </div>

              <div style={{ paddingBottom: "1rem" }}>
                <Text variant="headingMd" as="h5">
                  Number of Instafeeds
                </Text>
                <Button onClick={handleSelectPosts}>Select Instafeeds</Button>
              </div>

              <div style={{ paddingBottom: "1rem" }}>
                <Text variant="headingMd" as="h5">
                  Number of items in a row
                </Text>
                <Select
                  label="Number of items in a row"
                  options={instaRowItems}
                  // value=""
                  onChange={(value) => {
                    setSelectItems(value);
                  }}
                  value={selectItems}
                  labelHidden
                />
              </div>

              <div>
                <Text variant="headingMd" as="h5">
                  Number of Post
                </Text>
                <Select
                  label="Number of items in a row"
                  options={instaPosts}
                  // value=""
                  onChange={(value) => {
                    setSelectPosts(value);
                  }}
                  value={selectPosts}
                  labelHidden
                />
              </div>
            </Form>
          </LegacyCard>
        </div>
        <Button primary onClick={handleSave}>Save</Button>
      </Page>
    </>
  );
}
