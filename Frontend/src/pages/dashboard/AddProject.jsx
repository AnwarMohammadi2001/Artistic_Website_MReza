import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaCloudUploadAlt,
  FaSave,
  FaImage,
  FaPenNib,
  FaVideo,
  FaLink,
} from "react-icons/fa";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const AddProject = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    subCategoryId: "",
    technique: "",
    description: "",
    fullDescription: "",
    size: "",
    location: "",
    organizer: "",
    date: "",
    duration: "",
    exhibitionName: "",
    link: "",
    mediaType: "image",
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error("خطا در دریافت دسته‌ها:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "categoryId") {
      const selectedCat = categories.find((c) => c.id == value);
      setSubCategories(selectedCat ? selectedCat.SubCategories : []);
      setFormData((prev) => ({
        ...prev,
        categoryId: value,
        subCategoryId: "",
      }));
    }

    // اگر نوع مدیا تغییر کرد، پیش‌نمایش و فایل را پاک کن
    if (name === "mediaType") {
      setPreview(null);
      setFile(null);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // اعتبارسنجی فقط برای فیلدهای مهم
    if (!formData.title || !formData.categoryId) {
      toast.warning("عنوان و دسته‌بندی الزامی هستند!");
      return;
    }

    // اگر نوع مدیا ویدیو است، باید لینک وارد شده باشد
    if (formData.mediaType === "video" && !formData.link) {
      toast.warning("برای ویدیو، لینک الزامی است!");
      return;
    }

    // اگر نوع مدیا عکس است، باید فایل آپلود شده باشد (اختیاری اما توصیه می‌شود)
    if (formData.mediaType === "image" && !file) {
      toast.info(
        "آپلود تصویر توصیه می‌شود، اما می‌توانید بدون تصویر هم ادامه دهید.",
      );
      // میتوانید این خط را حذف کنید اگر می‌خواهید اجباری نباشد
    }

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    // فقط اگر فایل وجود دارد و نوع مدیا عکس است، فایل را اضافه کن
    if (file && formData.mediaType === "image") {
      data.append("image", file);
    }

    try {
      await axios.post(`${BASE_URL}/api/projects`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("پروژه با موفقیت ثبت شد!");
      // Reset form
      setFormData({
        title: "",
        categoryId: "",
        subCategoryId: "",
        technique: "",
        description: "",
        fullDescription: "",
        size: "",
        location: "",
        organizer: "",
        date: "",
        duration: "",
        exhibitionName: "",
        link: "",
        mediaType: "image",
      });
      setFile(null);
      setPreview(null);
    } catch (err) {
      toast.error("خطا در ثبت پروژه");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-6 min-h-screen  bg-gray-100 rounded-md dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans"
      dir="rtl"
    >
      <div className=" mx-auto">
        <div className="flex items-center gap-3 mb-8 border-b pb-4 border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold">افزودن محتوای جدید</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-6">
            {/* انتخاب دسته - اجباری */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md">
              <h3 className="font-bold mb-4 border-b pb-2 text-blue-600">
                دسته‌بندی (اجباری)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-500">
                    دسته اصلی <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="flex-1 p-3  rounded-md w-full  bg-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-cyan-700 outline-none transition"
                    required
                  >
                    <option value="">انتخاب کنید...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-500">
                    زیرمجموعه (اختیاری)
                  </label>
                  <select
                    name="subCategoryId"
                    value={formData.subCategoryId}
                    onChange={handleChange}
                    className="flex-1 p-3  w-full rounded-md  bg-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-cyan-700 outline-none transition"
                    disabled={!formData.categoryId}
                  >
                    <option value="">انتخاب کنید...</option>
                    {subCategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* مشخصات اثر - فقط عنوان اجباری */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md">
              <h3 className="font-bold mb-4 border-b pb-2 text-amber-600">
                مشخصات اثر
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">
                    عنوان اثر <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="flex-1 p-3  rounded-md w-full  bg-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-cyan-700 outline-none transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* <input
                    placeholder="تکنیک (اختیاری)"
                    name="technique"
                    value={formData.technique}
                    onChange={handleChange}
                    className="flex-1 p-3  rounded-md w-full  bg-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-cyan-700 outline-none transition"
                  />
                  <input
                    placeholder="سایز (اختیاری)"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="flex-1 p-3  rounded-md w-full  bg-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-cyan-700 outline-none transition"
                  />
                  <input
                    placeholder="نام نمایشگاه (اختیاری)"
                    name="exhibitionName"
                    value={formData.exhibitionName}
                    onChange={handleChange}
                    className="flex-1 p-3  rounded-md w-full  bg-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-cyan-700 outline-none transition"
                  />
                  <input
                    placeholder="مکان برگزاری (اختیاری)"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="flex-1 p-3  rounded-md w-full  bg-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-cyan-700 outline-none transition"
                  />
                  <input
                    placeholder="برگزار کننده (اختیاری)"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                    className="flex-1 p-3  rounded-md w-full  bg-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-cyan-700 outline-none transition"
                  />
                  <input
                    placeholder="تاریخ (اختیاری)"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="flex-1 p-3  rounded-md w-full  bg-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-cyan-700 outline-none transition"
                  />
                  <input
                    placeholder="مدت زمان (اختیاری)"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="flex-1 p-3  rounded-md w-full  bg-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-cyan-700 outline-none transition"
                  /> */}
                  {/* فیلد لینک - اگر ویدیو است، اهمیت بیشتری دارد */}
                  <div className="relative col-span-2">
                    <input
                      placeholder="لینک (اختیاری)"
                      name="link"
                      value={formData.link}
                      onChange={handleChange}
                      className="flex-1 p-3 rounded-md w-full bg-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-cyan-700 outline-none transition pr-10"
                    />
                    {formData.mediaType === "video" && (
                      <span className="absolute left-3 top-3 text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-2 py-1 rounded">
                        برای ویدیو ضروری
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* توضیحات - اختیاری */}
            {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md">
              <h3 className="font-bold mb-4 border-b pb-2 text-green-600">
                توضیحات (اختیاری)
              </h3>
              <div className="space-y-4">
                <textarea
                  placeholder="توضیحات کوتاه..."
                  name="description"
                  value={formData.description}
                  rows="2"
                  onChange={handleChange}
                  className="flex-1 p-3  rounded-md w-full  bg-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-cyan-700 outline-none transition"
                ></textarea>
                <textarea
                  placeholder="توضیحات کامل..."
                  name="fullDescription"
                  value={formData.fullDescription}
                  rows="5"
                  onChange={handleChange}
                  className="flex-1 p-3  rounded-md w-full  bg-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-cyan-700 outline-none transition"
                ></textarea>
              </div>
            </div> */}
          </div>

          {/* آپلود فایل - اختیاری */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md sticky top-6">
              <h3 className="font-bold mb-4 border-b pb-2 text-purple-600 flex items-center gap-2">
                {formData.mediaType === "image" ? <FaImage /> : <FaVideo />}
                {formData.mediaType === "image" ? "تصویر" : "ویدیو"}
              </h3>

              <div className="mb-4">
                <label className="block text-sm mb-2 font-bold">نوع مدیا</label>
                <select
                  name="mediaType"
                  value={formData.mediaType}
                  onChange={handleChange}
                  className="flex-1 p-3  rounded-md w-full  bg-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-cyan-700 outline-none transition"
                >
                  <option value="image">تصویر</option>
                  <option value="video">ویدیو</option>
                </select>
              </div>

              {formData.mediaType === "image" ? (
                <>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:bg-gray-50 transition relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FaCloudUploadAlt className="text-4xl mb-2 text-purple-500" />
                      <p className="text-sm">برای انتخاب تصویر کلیک کنید</p>
                      <p className="text-xs text-gray-400 mt-1">(اختیاری)</p>
                    </div>
                  </div>

                  {preview && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl p-6 text-center bg-blue-50 dark:bg-blue-900/20 transition">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FaLink className="text-4xl mb-2 text-blue-500" />
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        برای ویدیو، لینک وارد کنید
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        لینک ویدیو را در قسمت "لینک" در مشخصات اثر وارد کنید
                      </p>
                    </div>
                  </div>

                  {formData.link && (
                    <div className="mt-4">
                      <div className="text-sm text-gray-500 mb-2">
                        پیش‌نمایش لینک:
                      </div>
                      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
                        <div className="text-sm text-blue-500 dark:text-blue-400 break-all">
                          {formData.link}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  "در حال ارسال..."
                ) : (
                  <>
                    <FaSave /> ثبت پروژه
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;