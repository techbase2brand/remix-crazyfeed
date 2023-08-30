console.log("app code is working0");

async function extensionData() {
  try {
    const response = await fetch(
      "https://father-msgstr-wooden-guru.trycloudflare.com/api/get"
    );
    const instaData = await response.json();
    document.getElementById("instaTitle-os").innerHTML = instaData.instaTitle;
    let body = "";
    console.log("app dataaaaa", instaData);
    if (
      typeof instaData.instaData === "undefined" ||
      instaData.instaData.length == 0
    ) {
      body = "No posts found.";
    } else {
      let totalPosts = instaData.instaSelectPosts;
      if (instaData.instaData.length <= instaData.instaSelectPosts) {
        totalPosts = instaData.instaData.length;
      }
      let designClass = "instagram-feed-col-4-os";
      switch (instaData.instaSelectItems) {
        case "2":
          designClass = "instagram-feed-col-2-os";
          break;
        case "3":
          designClass = "instagram-feed-col-3-os";
          break;
        case "4":
          designClass = "instagram-feed-col-4-os";
          break;
        case "5":
          designClass = "instagram-feed-col-5-os";
          break;
      }
      for (var i = 0; i < totalPosts; i++) {
        // if (instaData.instaData[i].media_type == "IMAGE") {
        body += `<div class="instagram-feed-col-os ${designClass}" onclick="javascript:document.getElementById('showpop${i}').style.display='flex'">`;
        if (
          instaData.instaData[i].media_type == "IMAGE" ||
          instaData.instaData[i].media_type == "CAROUSEL_ALBUM"
        ) {
          body += `<img
          src="${instaData.instaData[i].media_url}"
          alt=""
        />`;
        } else {
          body += `<video controls>
          <source src="${instaData.instaData[i].media_url}" type="video/mp4" />
          Your browser does not support the video tag.
        </video>`;
        }
        body += `<div class="overlay-img-os"></div>
      </div>
      
      <section class="instagram-feed-popup-os" id="showpop${i}">
        <div class="instagram-feed-popup-row-os">
          <div class="instagram-feed-popup-col-1-os">`;
        if (instaData.instaData[i].media_type == "VIDEO") {
          body += `<video controls>
            <source src="${instaData.instaData[i].media_url}" type="video/mp4" />
            Your browser does not support the video tag.
          </video>`;
        } else {
          body += `<img
              src="${instaData.instaData[i].media_url}"
              alt=""
            />`;
        }
        body += `</div>
          <div class="instagram-feed-popup-col-2-os">      
            <div class="instagram-feed-cross-btn-os" onclick="javascript:document.getElementById('showpop${i}').style.display='none'">
              <span></span>
              <span></span>
            </div>
            <div class="details-heading">
              <h3>
                <span>${instaData.instaName}</span>
                <span>${instaData.instaUsername}</span>
              </h3>
            </div>
            <p>
              Caption : ${instaData.instaData[i].caption}
            </p>
            <p>
              Likes : ${instaData.instaData[i].like_count}
            </p>
            <p>
              Comments : ${instaData.instaData[i].comments_count}
            </p>
          </div>
        </div>
    </section>
      `;
      }
    }
    // console.log(body, "body-os")
    document.getElementById("InstaPic").innerHTML = body;

    //will insert the other file data
  } catch (error) {
    console.log("Error:", error);
  }
}
extensionData();
