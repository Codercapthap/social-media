import { memo } from "react";
import AvatarEditor from "react-avatar-edit";

const MyEditor = ({ src, width, height, border, scale, rotate, onAvatar }) => {
  console.log("here");

  return (
    <div>
      <AvatarEditor
        src={src}
        width={width}
        height={height}
        border={border}
        scale={scale}
        rotate={rotate}
        onCrop={(e) => {
          onAvatar(e);
        }}
      />
    </div>
  );
};

export default memo(MyEditor);
