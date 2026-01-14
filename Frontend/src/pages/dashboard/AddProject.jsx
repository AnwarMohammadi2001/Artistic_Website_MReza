import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance"; // ✅ ایمپورت از فایل تنظیمات
import { toast } from "react-toastify";
import { FaCloudUploadAlt, FaSave, FaImage, FaPenNib } from "react-icons/fa";

const AddProject = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State برای پیش‌نمایش عکس
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
    // دریافت دسته‌ها هنگام لود صفحه
    axiosInstance.get("/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // فیلتر کردن زیرمجموعه‌ها وقتی دسته اصلی تغییر می‌کند
    if (name === "categoryId") {
      const selectedCat = categories.find((c) => c.id == value);
      setSubCategories(selectedCat ? selectedCat.SubCategories : []);
      setFormData((prev) => ({ ...prev, categoryId: value, subCategoryId: "" }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // ایجاد پیش‌نمایش
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    
    if (file) {
      data.append("image", file);
    } else {
        toast.warning("لطفاً یک تصویر یا ویدیو انتخاب کنید");
        setLoading(false);
        return;
    }

    try {
      await axiosInstance.post("/projects", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("پروژه جدید با موفقیت ثبت شد!");
      // پاکسازی فرم
      setFormData({
        title: "", categoryId: "", subCategoryId: "", technique: "",
        description: "", fullDescription: "", size: "", location: "",
        organizer: "", date: "", duration: "", exhibitionName: "",
        link: "", mediaType: "image",
      });
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      toast.error("خطا در ثبت پروژه. لطفاً ورودی‌ها را بررسی کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex items-center gap-3 mb-8 border-b pb-4 border-gray-200 dark:border-gray-700">
          <FaPenNib className="text-3xl text-amber-600" />
          <h2 className="text-2xl font-bold">افزودن اثر یا محتوای جدید</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ستون راست: اطلاعات اصلی */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* کارت انتخاب دسته */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
              <h3 className="font-bold mb-4 border-b pb-2 text-blue-600">دسته‌بندی</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-500">دسته اصلی <span className="text-red-500">*</span></label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">انتخاب کنید...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-500">زیرمجموعه</label>
                  <select
                    name="subCategoryId"
                    value={formData.subCategoryId}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                    disabled={!formData.categoryId}
                  >
                    <option value="">انتخاب کنید...</option>
                    {subCategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* کارت مشخصات اثر */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
              <h3 className="font-bold mb-4 border-b pb-2 text-amber-600">مشخصات اثر</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">عنوان اثر <span className="text-red-500">*</span></label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-3 border rounded-xl dark:bg-gray-700 focus:ring-2 focus:ring-amber-500 outline-none" required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <input placeholder="تکنیک (مثلاً رنگ روغن)" name="technique" value={formData.technique} onChange={handleChange} className="p-3 border rounded-xl dark:bg-gray-700 outline-none focus:border-amber-500" />
                   <input placeholder="سایز (مثلاً 100x70)" name="size" value={formData.size} onChange={handleChange} className="p-3 border rounded-xl dark:bg-gray-700 outline-none focus:border-amber-500" />
                   <input placeholder="نام نمایشگاه" name="exhibitionName" value={formData.exhibitionName} onChange={handleChange} className="p-3 border rounded-xl dark:bg-gray-700 outline-none focus:border-amber-500" />
                   <input placeholder="مکان برگزاری" name="location" value={formData.location} onChange={handleChange} className="p-3 border rounded-xl dark:bg-gray-700 outline-none focus:border-amber-500" />
                   <input placeholder="برگزار کننده" name="organizer" value={formData.organizer} onChange={handleChange} className="p-3 border rounded-xl dark:bg-gray-700 outline-none focus:border-amber-500" />
                   <input placeholder="تاریخ (مثلاً 1402/05/10)" name="date" value={formData.date} onChange={handleChange} className="p-3 border rounded-xl dark:bg-gray-700 outline-none focus:border-amber-500" />
                   <input placeholder="مدت زمان" name="duration" value={formData.duration} onChange={handleChange} className="p-3 border rounded-xl dark:bg-gray-700 outline-none focus:border-amber-500" />
                   <input placeholder="لینک خارجی (اختیاری)" name="link" value={formData.link} onChange={handleChange} className="p-3 border rounded-xl dark:bg-gray-700 outline-none focus:border-amber-500" />
                </div>
              </div>
            </div>

            {/* توضیحات */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
              <h3 className="font-bold mb-4 border-b pb-2 text-green-600">توضیحات</h3>
              <div className="space-y-4">
                <div>
                   <label className="block text-sm mb-2 text-gray-500">توضیحات کوتاه (خلاصه)</label>
                   <textarea name="description" value={formData.description} rows="2" onChange={handleChange} className="w-full p-3 border rounded-xl dark:bg-gray-700 focus:ring-2 focus:ring-green-500 outline-none"></textarea>
                </div>
                <div>
                   <label className="block text-sm mb-2 text-gray-500">توضیحات کامل</label>
                   <textarea name="fullDescription" value={formData.fullDescription} rows="5" onChange={handleChange} className="w-full p-3 border rounded-xl dark:bg-gray-700 focus:ring-2 focus:ring-green-500 outline-none"></textarea>
                </div>
              </div>
            </div>

          </div>

          {/* ستون چپ: آپلود فایل */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md sticky top-6">
              <h3 className="font-bold mb-4 border-b pb-2 text-purple-600 flex items-center gap-2">
                <FaImage /> تصویر یا ویدیو
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm mb-2 font-bold">نوع مدیا</label>
                <select name="mediaType" value={formData.mediaType} onChange={handleChange} className="w-full p-3 border rounded-xl dark:bg-gray-700">
                    <option value="image">تصویر</option>
                    <option value="video">ویدیو</option>
                </select>
              </div>

              {/* ناحیه آپلود */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition relative">
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  accept={formData.mediaType === 'image' ? "image/*" : "video/*"}
                />
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <FaCloudUploadAlt className="text-4xl mb-2 text-purple-500" />
                  <p className="text-sm font-bold">برای انتخاب فایل کلیک کنید</p>
                  <p className="text-xs mt-1">حداکثر حجم: 50MB</p>
                </div>
              </div>

              {/* پیش‌نمایش */}
              {preview && (
                <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative group">
                  {formData.mediaType === 'image' ? (
                    <img src={preview} alt="Preview" className="w-full h-auto object-cover" />
                  ) : (
                    <video src={preview} controls className="w-full h-auto" />
                  )}
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    پیش‌نمایش
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:-translate-y-1 transition duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>در حال ارسال...</>
                ) : (
                  <><FaSave /> ثبت نهایی پروژه</>
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