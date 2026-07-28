module.exports = function (migration) {
  migration.editContentType("page").editField("sections").items({
    type: "Link",
    linkType: "Entry",
    validations: [
      {
        linkContentType: [
          "banner",
          "mediaContentBlock",
          "cardCollection",
          "richTextBlock",
          "richTextItem",
          "accordion",
          "resourceLibrary",
        ],
      },
    ],
  });
};
