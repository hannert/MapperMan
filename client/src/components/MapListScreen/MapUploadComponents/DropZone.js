import React from "react";

const Banner = ({ onClick, onDrop }) => {
  const handleDragOver = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    ev.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    onDrop(ev.dataTransfer.files);
  };

  return (
    <div
      sx={{display: "flex", align : "center", justifyContent: "center", width: "100%"}}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <span style={{fontSize:'1.5rem', color:'#ccc', display:'block', margin:'0.5rem 0'}}>Click to Add files</span>
      <span style={{fontSize:'1.5rem', color:'#ccc', display:'block', margin:'0.5rem 0'}}>Or</span>
      <span style={{fontSize:'1.5rem', color:'#ccc', display:'block', margin:'0.5rem 0'}}>Drag and Drop files here</span>
    </div>
  );
};

const DropZone = ({ onChange, accept = ["*"] }) => {
  const inputRef = React.useRef(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleChange = (ev) => {
    onChange(ev.target.files);
  };

  const handleDrop = (files) => {
    onChange(files);
  };

  return (
    <div sx={{display: "flex", align : "center", justifyContent: "center", width: "100%"}}>
      <Banner onClick={handleClick} onDrop={handleDrop} />
      <input
        type="file"
        aria-label="add files"
        sx={{width:'100%', height:'100%', display:'none'}}
        ref={inputRef}
        multiple="multiple"
        onChange={handleChange}
        accept={accept.join(",")}
      />
    </div>
  );
};

export { DropZone };
