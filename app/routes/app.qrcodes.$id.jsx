// import { useEffect, useState } from "react";
// import { json, redirect } from "@remix-run/node";
// import axios from "axios";
// import { cors } from "remix-utils";
// import {
//   useActionData,
//   useLoaderData,
//   useNavigation,
//   useSubmit,
//   useNavigate,
// } from "@remix-run/react";
// import { authenticate } from "../shopify.server";
// import {
//   LegacyCard,
//   Select,
//   Form,
//   Card,
//   Bleed,
//   Button,
//   ChoiceList,
//   Divider,
//   EmptyState,
//   HorizontalStack,
//   InlineError,
//   Layout,
//   Page,
//   Text,
//   TextField,
//   Thumbnail,
//   VerticalStack,
//   PageActions,
// } from "@shopify/polaris";
// import { ImageMajor } from "@shopify/polaris-icons";

// import db from "../db.server";
// import {
//   getInstafeed,
//   validateInstafeed,
//   getId,
// } from "../models/InstaFeed.server";
// import InstafeedPopup from "./Components/InstafeedPopup";

// export async function loader({ request, params }) {
//   const { admin, session } = await authenticate.admin(request);
//   const { shop } = session;
//   const editData = db.instaFeed.findFirst({ where: { shop } });
//   console.log(editData, "editdataaaaaaaaaaaaaaaaaaa");
//   if (params?.id === "new") {
//     return json({
//       destination: "product",
//       title: "",
//       editData: editData,
//     });
//   }

//   return json(await getInstafeed(shop, admin.graphql));
// }

// export async function action({ request, params }) {
//   const { session } = await authenticate.admin(request);
//   const { shop } = session;

//   if (request.method === "DELETE") {
//     await db.instaFeed.delete({ where: { id: Number(params?.id) } });
//     return redirect("/app");
//   }

//   /** @type {any} */
//   const data = {
//     ...Object.fromEntries(await request.formData()),
//     shop,
//   };

//   const errors = validateInstafeed(data);

//   if (errors) {
//     return json({ errors }, { status: 422 });
//   }

//   //
//   const newData = await getId(shop);
//   data.instaTitle = data.instaTitle;
//   data.instaUsername = data.instaUsername;
//   data.instaSelectItems = data.instaSelectItems;
//   data.instaSelectPosts = data.instaSelectPosts;
//   data.instCheckedImageIds = data.instCheckedImageIds;

//   const InstaFeed = newData?.id
//     ? await db.instaFeed.update({ where: { id: newData?.id }, data })
//     : await db.instaFeed.create({ data });

//   console.log(InstaFeed, "InstaFeed database data");
//   return InstaFeed;
// }

// export default function QRCodeForm() {
//   // insta form states starts
//   const [username, setUsername] = useState("");
//   const [title, setTitle] = useState("");
//   const [selectItems, setSelectItems] = useState("");
//   const [selectPosts, setSelectPosts] = useState("");
//   const [formPreFill, setformPreFill] = useState("");
//   const [notification, setNotification] = useState(false);
//   const [errorNotification, setErrorNotification] = useState(false);
//   const [activePopup, setActivePopup] = useState(false);
//   const [instaData, setInstaData] = useState([]);
//   const [sentValues, setSentValues] = useState([]);
//   const [preFilledCheckedPosts, setPreFilledCheckedPosts] = useState([]);
//   const [checkedValues, setCheckedValues] = useState([]);
//   // insta form states ends

//   const [isMobile, setIsMobile] = useState(false);
//   const errors = useActionData()?.errors || {};

//   const InstaFeed = useLoaderData();
//   const [formState, setFormState] = useState(InstaFeed);
//   const [cleanFormState, setCleanFormState] = useState(InstaFeed);
//   const isDirty = JSON.stringify(formState) !== JSON.stringify(cleanFormState);

//   const nav = useNavigation();
//   const isSaving = nav.state === "submitting" && nav.formMethod === "POST";
//   const isDeleting = nav.state === "submitting" && nav.formMethod === "DELETE";
//   const navigate = useNavigate();

//   // updated checked values assign to sentvalues
//   // useEffect(() => {
//   //   setSentValues(checkedValues);
//   // }, [checkedValues]);
//   // const instCheckedImageIds = JSON.stringify(checkedValues);
//   // console.log(checkedValues, "checkedValues values")
//   // console.log(instCheckedImageIds, "instCheckedImageIds values")

//   const instaFormData = {
//     username,
//     title,
//     selectItems,
//     selectPosts,
//   };
  
//   const submit = useSubmit();
//   async function handleSave() {
//     const instCheckedImageIds = JSON.stringify(checkedValues);
//     const data = {
//       instaUsername: instaFormData.username || "",
//       instaTitle: instaFormData.title || "",
//       instaSelectItems: instaFormData.selectItems || "",
//       instaSelectPosts: instaFormData.selectPosts || "",
//       instCheckedImageIds: instCheckedImageIds || "",
//     };

//     if (
//       username == "" ||
//       title == "" ||
//       selectItems == (0 || "") ||
//       selectPosts == (0 || "")
//     ) {
//       setErrorNotification(true);
//       setTimeout(() => {
//         setErrorNotification(false);

//         // setPreFilledCheckedPosts(data?.sentValuesJson);
//       }, 5000);

//       return false;
//     }
//     setCleanFormState({ ...formState });
//     submit(data, { method: "post" });
//     console.log(data, "Submitted form data");
//     // console.log("Submitted form data");
//   }

//   // custom code
//   const instaRowItems = [
//     { label: "0", value: "0" },
//     { label: "2", value: "2" },
//     { label: "3", value: "3" },
//     { label: "4", value: "4" },
//     { label: "5", value: "5" },
//   ];

//   const instaPosts = [
//     { label: "0", value: "0" },
//     { label: "10", value: "10" },
//     { label: "20", value: "20" },
//     { label: "30", value: "30" },
//     { label: "40", value: "40" },
//   ];

//   // realtime instaPosts
//   const handleSelectPosts = async () => {
//     const accessToken =
//       "EAAOqIm0DdnIBOZB1DQxUK1pR1QICNKZANHjKPK6ccUnKm3JjwByWIoabrO53LjJYLncsDqww8HVfnrmNfyHy7hS6yaBUNxffm0HbMWZBGzwWjIuAKBZAUXMiVei7DjqoSBrF8yQBWYbR2KDdkwjywAI1zq4UcBeOM8OSFD0BNnfQ8ZAZAHmm2ni2C8uIeZANSkvgEq2qSRzZCzJlgMnu4NG60gKniBY9";
//     const instagramAccountId = "17841444577460986";
//     let endpoint = `https://graph.facebook.com/v12.0/${instagramAccountId}`;
//     let url = `${endpoint}?fields=business_discovery.username(${username}){username,website,name,ig_id,id,profile_picture_url,biography,follows_count,followers_count,media_count,media{id,caption,like_count,comments_count,timestamp,username,media_product_type,media_type,owner,permalink,media_url,children{media_url}}}&access_token=${accessToken}`;
//     try {
//       const response = await axios.get(url);
//       if (response.status === 200) {
//         setInstaData(response.data);
//         // console.log(instaData, "insta posts data");
//       }
//     } catch (error) {
//       console.log(error, "data not found");
//     }

//     if (instaData) {
//       setActivePopup(true);
//     }
//     // if (username !== "") {
//     //   const selectedPostRes = await fetch("/api/get-instaposts", {
//     //     method: "POST",
//     //     headers: {
//     //       Accept: "application/json",
//     //       "Content-Type": "application/json",
//     //     },
//     //     body: JSON.stringify({ username: username }),
//     //   });
//     //   const res = await selectedPostRes.json();
//     //   console.log(res, "handleSelectPosts data");
//     //   if (res.error === "not_found") {
//     //     alert("Records don't exists. Please select another username.");
//     //   } else {
//     //     setActivePopup(true);
//     //     setInstaData(res);
//     //   }
//     // } else {
//     //   alert("Please fill username field before clicking select posts");
//     // }
//   };

//   useEffect(() => {
//     setUsername(InstaFeed.instaUsername);
//     setTitle(InstaFeed.instaTitle);
//     setSelectItems(InstaFeed.instaSelectItems);
//     setSelectPosts(InstaFeed.instaSelectPosts);
//     setCheckedValues(InstaFeed.instCheckedImageIds);
//   }, []);

//   return (
//     <>
//       {activePopup && (
//         <InstafeedPopup
//           instaData={instaData}
//           activePopup={activePopup}
//           setActivePopup={setActivePopup}
//           // setSentValues={setSentValues}
//           // sentValues={sentValues}
//           preFilledCheckedPosts={preFilledCheckedPosts}
//           checkedValues={checkedValues}
//           setCheckedValues={setCheckedValues}
//         />
//       )}
//       <Page narrowWidth>
//         <div className="insta-form-os" style={{ paddingBottom: "1.5rem" }}>
//           <LegacyCard sectioned>
//             <Form onSubmit={handleSave}>
//               <div style={{ paddingBottom: "1rem" }}>
//                 <Text variant="headingMd" as="h5">
//                   Instagram Business Username
//                 </Text>
//                 <TextField
//                   label=""
//                   type="text"
//                   autoComplete=""
//                   placeholder="Username"
//                   // value=""
//                   value={username}
//                   onChange={(value) => {
//                     setUsername(value);
//                   }}
//                 />
//               </div>

//               <div style={{ paddingBottom: "1rem" }}>
//                 <Text variant="headingMd" as="h5">
//                   Title
//                 </Text>
//                 <TextField
//                   label=""
//                   type="text"
//                   placeholder="Title"
//                   autoComplete=""
//                   // value=""
//                   value={title}
//                   onChange={(value) => {
//                     setTitle(value);
//                   }}
//                 />
//               </div>

//               <div style={{ paddingBottom: "1rem" }}>
//                 <Text variant="headingMd" as="h5">
//                   Number of Instafeeds
//                 </Text>
//                 <Button onClick={handleSelectPosts}>Select Instafeeds</Button>
//               </div>

//               <div style={{ paddingBottom: "1rem" }}>
//                 <Text variant="headingMd" as="h5">
//                   Number of items in a row
//                 </Text>
//                 <Select
//                   label="Number of items in a row"
//                   options={instaRowItems}
//                   // value=""
//                   onChange={(value) => {
//                     setSelectItems(value);
//                   }}
//                   value={selectItems}
//                   labelHidden
//                 />
//               </div>

//               <div style={{ paddingBottom: "1rem" }}>
//                 <Text variant="headingMd" as="h5">
//                   Number of Post
//                 </Text>
//                 <Select
//                   label="Number of items in a row"
//                   options={instaPosts}
//                   // value=""
//                   onChange={(value) => {
//                     setSelectPosts(value);
//                   }}
//                   value={selectPosts}
//                   labelHidden
//                 />
//               </div>

//               {/* <Button
//               onClick={handleSubmit}
//               primary
//             >
//               Submit
//             </Button> */}
//             </Form>
//           </LegacyCard>
//         </div>

//         {/* <ui-title-bar title={InstaFeed?.id ? "Edit QR code" : "Create new QR code"}>
//         <button variant="breadcrumb" onClick={() => navigate("/app")}>
//           QR codes
//         </button>
//       </ui-title-bar>
//       <Layout>
//         <Layout.Section>
//           <VerticalStack gap="5">
//             <Card>
//               <VerticalStack gap="5">
//                 <Text as={"h2"} variant="headingLg">
//                   Title
//                 </Text>
//                 <TextField
//                   id="title"
//                   helpText="Only store staff can see this title"
//                   label="title"
//                   labelHidden
//                   autoComplete="off"
//                   value={formState.title}
//                   onChange={(title) =>
//                     setFormState({ ...formState, title: title })
//                   }
//                   error={errors.title}
//                 />
//               </VerticalStack>
//             </Card>
//             <Card>
//               <VerticalStack gap="5">
//                 <HorizontalStack align="space-between">
//                   <Text as={"h2"} variant="headingLg">
//                     Product
//                   </Text>
//                   {formState.productId ? (
//                     <Button plain onClick={selectProduct}>
//                       Change product
//                     </Button>
//                   ) : null}
//                 </HorizontalStack>
//                 {formState.productId ? (
//                   <HorizontalStack blockAlign="center" gap={"5"}>
//                     <Thumbnail
//                       source={formState.productImage || ImageMajor}
//                       alt={formState.productAlt}
//                     />
//                     <Text as="span" variant="headingMd" fontWeight="semibold">
//                       {formState.productTitle}
//                     </Text>
//                   </HorizontalStack>
//                 ) : (
//                   <VerticalStack gap="2">
//                     <Button onClick={selectProduct} id="select-product">
//                       Select product
//                     </Button>
//                     {errors.productId ? (
//                       <InlineError
//                         message={errors.productId}
//                         fieldID="myFieldID"
//                       />
//                     ) : null}
//                   </VerticalStack>
//                 )}
//                 <Bleed marginInline="20">
//                   <Divider />
//                 </Bleed>
//                 <HorizontalStack
//                   gap="5"
//                   align="space-between"
//                   blockAlign="start"
//                 >
//                   <ChoiceList
//                     title="Scan destination"
//                     choices={[
//                       { label: "Link to product page", value: "product" },
//                       {
//                         label: "Link to checkout page with product in the cart",
//                         value: "cart",
//                       },
//                     ]}
//                     selected={[formState.destination]}
//                     onChange={(destination) =>
//                       setFormState({
//                         ...formState,
//                         destination: destination[0],
//                       })
//                     }
//                     error={errors.destination}
//                   />
//                   {QRCode.destinationUrl ? (
//                     <Button plain url={QRCode.destinationUrl} external>
//                       Go to destination URL
//                     </Button>
//                   ) : null}
//                 </HorizontalStack>
//               </VerticalStack>
//             </Card>
//           </VerticalStack>
//         </Layout.Section>
//         <Layout.Section secondary>
//           <Card>
//             <Text as={"h2"} variant="headingLg">
//               QR code
//             </Text>
//             {QRCode ? (
//               <EmptyState image={QRCode.image} imageContained={true} />
//             ) : (
//               <EmptyState image="">
//                 Your QR code will appear here after you save
//               </EmptyState>
//             )}
//             <VerticalStack gap="3">
//               <Button
//                 disabled={!QRCode?.image}
//                 url={QRCode?.image}
//                 download
//                 primary
//               >
//                 Download
//               </Button>
//               <Button
//                 disabled={!QRCode?.id}
//                 url={`/qrcodes/${QRCode?.id}`}
//                 external
//               >
//                 Go to public URL
//               </Button>
//             </VerticalStack>
//           </Card>
//         </Layout.Section>
//         <Layout.Section></Layout.Section>
//       </Layout> */}
//         <PageActions
//           // secondaryActions={[
//           //   {
//           //     content: "Delete",
//           //     loading: isDeleting,
//           //     // disabled: !QRCode.id || !QRCode || isSaving || isDeleting,
//           //     destructive: true,
//           //     outline: true,
//           //     onAction: () => submit({}, { method: "delete" }),
//           //   },
//           // ]}
//           primaryAction={{
//             content: "Save",
//             loading: isSaving,
//             // disabled:
//             // !isDirty ||
//             // isSaving ||
//             // isDeleting ||
//             // instaFormData.title === "" ||
//             // instaFormData.username === "" ||
//             // instaFormData.selectItems === "0" ||
//             // instaFormData.selectPosts === "0",
//             onAction: handleSave,
//           }}
//         />
//       </Page>
//     </>
//   );
// }