import { Node, mergeAttributes } from "@tiptap/core";

export const Video = Node.create({
  name: "video",

  group: "block",

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      type: {
        default: "video/mp4",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "video",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(
        {
          controls: "true",
          style: "max-width:100%;",
        },
        HTMLAttributes
      ),
      [
        "source",
        {
          src: HTMLAttributes.src,
          type: HTMLAttributes.type,
        },
      ],
    ];
  },
});
