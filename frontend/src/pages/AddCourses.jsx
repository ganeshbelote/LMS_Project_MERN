
import React, { useState } from "react";
import { successMsg, failureMsg } from "../utils/message.js";
import { ToastContainer } from "react-toastify";

const AddCourses = () => {
  // formData holds our course data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    thumbnail: null,
    lectures: [{ video: null, videoTitle: "" }], // Dynamically stored lectures
  });
  
  // formKey is used to force re-mount of file inputs so they clear after reset
  const [formKey, setFormKey] = useState(0);

  // Handle Thumbnail Upload
  const handleThumbnailChange = (e) => {
    setFormData({ ...formData, thumbnail: e.target.files[0] });
  };

  // Handle Video Upload (one video per lecture)
  const handleVideoChange = (index, e) => {
    const updatedLectures = [...formData.lectures];
    updatedLectures[index].video = e.target.files[0]; // Only one video per lecture
    setFormData({ ...formData, lectures: updatedLectures });
  };

  // Handle Title Change for each video lecture
  const handleTitleChange = (index, e) => {
    const updatedLectures = [...formData.lectures];
    updatedLectures[index].videoTitle = e.target.value;
    setFormData({ ...formData, lectures: updatedLectures });
  };

  // Add New Lecture Field for an additional video and title
  const addLectureField = () => {
    setFormData({
      ...formData,
      lectures: [...formData.lectures, { video: null, videoTitle: "" }],
    });
  };

  // Handle Upload
  const handleUpload = async (e) => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("thumbnail", formData.thumbnail);
    data.append("token", localStorage.getItem("token"));

    // IMPORTANT: Append each video and its title.
    // Using the same key names lets multer group the files/values into arrays.
    formData.lectures.forEach((lecture) => {
      if (lecture.video && lecture.videoTitle) {
        data.append("videos", lecture.video);
        data.append("videoTitles", lecture.videoTitle);
      }
    });

    try {
      const response = await fetch("http://localhost:8000/api/v1/courses/", {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        successMsg("Upload successful!");

        // ✅ Reset Form After Success:
        // Clear all fields and increment formKey to force file input re-mount.
        setFormData({
          title: "",
          description: "",
          price: "",
          thumbnail: null,
          lectures: [{ video: null, videoTitle: "" }],
        });
        setFormKey((prevKey) => prevKey + 1);
      } else {
        failureMsg("Upload failed: " + result.message);
      }
    } catch (error) {
      failureMsg("Upload failed");
    }
  };

  return (
    <div
      className="lg:p-12 py-12 px-4 min-h-screen flex items-center justify-center bg-[#121928] text-white mt-6 md:mt-12 lg:mt-16 w-full lg:w-[80vw] lg:absolute lg:right-0"
    >
      <div className="add-course-form w-full max-w-md py-8 px-8 lg:px-12 bg-[#1C263C] shadow-2xl shadow-black rounded-xl flex flex-col gap-5 items-center justify-center">
        <h2
          className="py-2 px-8 bg-zinc-900 rounded-4xl text-center lg:text-xl font-bold shadow-2xs shadow-amber-50"
        >
          Add Course
        </h2>
        <input
          className="w-full bg-[#1F2937] shadow-lg shadow-black font-semibold outline-0 rounded-2xl"
          type="text"
          placeholder="Title .."
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
          style={{ padding: "10px 25px" }}
        />
        <textarea
          className="w-full bg-[#1F2937] shadow-lg shadow-black font-semibold outline-0 rounded-2xl "
          name="description"
          placeholder="Description.."
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
          style={{ padding: "10px 25px" }}
        ></textarea>
        <input
          className="w-full bg-[#1F2937] shadow-lg shadow-black  font-semibold outline-0 rounded-2xl "
          type="text"
          placeholder="Price .."
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
          required
          style={{ padding: "10px 25px" }}
        />
        <label className=" text-zinc-500 font-semibold" htmlFor="thumbnail">
          <i>Thumbnail*</i>
        </label>
        {/* Use formKey in key to force re-mount after reset */}
        <input
          key={`thumbnail-${formKey}`}
          id="thumbnail"
          className="w-full bg-[#1F2937] shadow-lg shadow-black  font-semibold outline-0 rounded-2xl"
          name="thumbnail"
          type="file"
          onChange={handleThumbnailChange}
          required
          style={{ padding: "10px 25px" }}
        />

        {/* Dynamic Video & Title Inputs */}
        {formData.lectures.map((lecture, index) => (
          <div key={index} className="flex flex-col">
            <label className=" text-zinc-500 font-semibold">
              <i>Video {index + 1}*</i>
            </label>
            {/* Use formKey in key for video input */}
            <input
              key={`video-${index}-${formKey}`}
              className="w-full bg-[#1F2937] shadow-lg shadow-black  font-semibold outline-0 rounded-2xl"
              type="file"
              accept="video/*"
              onChange={(e) => handleVideoChange(index, e)}
              required
              style={{ padding: "10px 25px" }}
            />
            <input
              className="w-full bg-[#1F2937] shadow-lg shadow-black  font-semibold outline-0 rounded-2xl"
              type="text"
              placeholder="Video Title"
              value={lecture.videoTitle}
              onChange={(e) => handleTitleChange(index, e)}
              required
              style={{ padding: "10px 25px", marginTop: "10px" }}
            />
          </div>
        ))}

        {/* Button to Add More Lectures */}
        <button
          className="bg-green-600 text-white  font-semibold font rounded-lg cursor-pointer hover:scale-105"
          onClick={addLectureField}
          style={{ padding: "8px 15px", marginTop: "10px" }}
        >
          Add Another Video
        </button>

        <button
          className="bg-blue-600 text-white  font-semibold font rounded-lg cursor-pointer hover:scale-105"
          onClick={handleUpload}
          style={{ padding: "10px 15px"}}
        >
          Add Course
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddCourses;
