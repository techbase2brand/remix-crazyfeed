import React, { useState, useEffect } from "react";
import { Text, Button } from "@shopify/polaris";
import styles from "./css/custom-os.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

const InstafeedPopup = ({
  activePopup,
  setActivePopup,
  instaData,
  preFilledCheckedPosts,
  checkedValues,
  setCheckedValues,
}) => {
  console.log(instaData, "ggggggggggggggggggggggg")
  
  const [checkedValuesCount, setCheckedValuesCount] = useState(0);
  const instaAllPosts = instaData?.business_discovery?.media?.data;

  useEffect(() => {
    const newjson = JSON.parse(preFilledCheckedPosts);
    setCheckedValues(newjson);
    setCheckedValuesCount(newjson.length); // Initialize the count based on the pre-filled data
  }, [preFilledCheckedPosts]); // Watch for changes in preFilledCheckedPosts

  const handleCheck = (e, value) => {
    if (e.target.checked) {
      setCheckedValues((prevState) => [...prevState, value]);
      setCheckedValuesCount((prevCount) => prevCount + 1);
    } else {
      setCheckedValues((prevState) =>
        prevState.filter((item) => item !== value)
      );
      setCheckedValuesCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
    }
  };
  return (
    <section className="InstafeedPopup-section-os">
      <div className="InstafeedPopup-data-outer-os">
        <div className="InstafeedPopup-data-os">
          <div className="InstafeedPopup-heading-os">
            <Text variant="headingMd" as="h5">
              Add Instafeeds
            </Text>
            <button
              onClick={() => {
                if (activePopup) {
                  setActivePopup(false);
                }
              }}
              className="InstafeedPopup-close-btn-os"
            >
              <span>
                <svg
                  viewBox="0 0 20 20"
                  className="Polaris-Icon__Svg_375hu"
                  focusable="false"
                  aria-hidden="true"
                >
                  <path d="M12.72 13.78a.75.75 0 1 0 1.06-1.06l-2.72-2.72 2.72-2.72a.75.75 0 0 0-1.06-1.06l-2.72 2.72-2.72-2.72a.75.75 0 0 0-1.06 1.06l2.72 2.72-2.72 2.72a.75.75 0 1 0 1.06 1.06l2.72-2.72 2.72 2.72Z"></path>
                </svg>
              </span>
            </button>
          </div>
          <div className="InstafeedPopup-data-row-os">
            {instaAllPosts.map((value, index) => {
              return (
                <div key={index} className="multiple-filters-checkbox-col-os">
                  <div className="InstafeedPopup-checkbox-os">
                    <label className="multiple-filters-checkbox-os">
                      <input
                        type="checkbox"
                        checked={
                          checkedValues.includes(value?.id) ? true : false
                        }
                        onChange={(e) => handleCheck(e, value.id)}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="InstafeedPopup-img">
                    {value?.media_type === "IMAGE" ||
                    value.media_type === "CAROUSEL_ALBUM" ? (
                      <img src={value?.media_url} alt="" />
                    ) : (
                      <video controls>
                        <source src={value?.media_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                  <div className="InstafeedPopup-insta-title-os">
                    <Text variant="headingSm" as="h6">
                      {(() => {
                        let words = value?.caption?.split(" ");
                        return words?.length > 5
                          ? words?.slice(0, 5)?.join(" ") + "..."
                          : value?.caption;
                      })()}
                    </Text>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="InstafeedPopup-selectedItems-btns-row-os">
            <div className="InstafeedPopup-selectedItems-os">
              <Text variant="headingSm" as="h6">
                {checkedValuesCount}/{instaAllPosts?.length} Instafeeds selected
              </Text>
            </div>
            <div className="InstafeedPopup-selectedItems-btns-os">
              <Button
                onClick={() => {
                  if (activePopup) {
                    setActivePopup(false);
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (activePopup) {
                    setActivePopup(false);
                  }
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="InstafeedPopup-overlay-os"></div>
    </section>
  );
};

export default InstafeedPopup;
