import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import {
  FaCloudUploadAlt,
  FaSave,
  FaImage,
  FaVideo,
  FaLink,
  FaPlus,
  FaEdit,
  FaPalette,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaBuilding,
  FaFileAlt,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";
import { MdCategory, MdDescription } from "react-icons/md";

const AddProject = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

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
        const res = await axiosInstance.get("/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("خطا در دریافت دسته‌ها:", err);
        toast.error("خطا در دریافت دسته‌بندی‌ها");
      }
    };

    fetchCategories();
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "عنوان اثر الزامی است";
    }

    if (!formData.categoryId) {
      errors.categoryId = "دسته‌بندی اصلی الزامی است";
    }

    if (formData.mediaType === "video" && !formData.link.trim()) {
      errors.link = "برای ویدیو، لینک الزامی است";
    }

    if (formData.mediaType === "image" && !file) {
      errors.file = "برای تصویر، آپلود فایل الزامی است";
    }

    if (formData.link && !isValidUrl(formData.link)) {
      errors.link = "لینک وارد شده معتبر نیست";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updatedForm = { ...prev, [name]: value };

      // اگر categoryId تغییر کرد، subCategory ریست شود
      if (name === "categoryId") {
        const selectedCat = categories.find(
          (c) => String(c.id) === String(value),
        );
        setSubCategories(selectedCat?.SubCategories || []);
        updatedForm.subCategoryId = "";
      }

      // اگر mediaType تغییر کرد، فایل و پیش‌نمایش ریست شود
      if (name === "mediaType") {
        setPreview(null);
        setFile(null);
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          file: null,
          link: null,
        }));
      }

      return updatedForm;
    });

    // پاک کردن خطای این فیلد هنگام تغییر
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // بررسی حجم فایل (حداکثر 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("حجم فایل باید کمتر از ۵ مگابایت باشد");
      return;
    }

    // بررسی نوع فایل
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("لطفاً فقط فایل تصویری انتخاب کنید");
      return;
    }

    setFile(selectedFile);
    setValidationErrors((prev) => ({ ...prev, file: null }));

    // ایجاد پیش‌نمایش
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("لطفاً خطاهای فرم را برطرف کنید");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    if (file && formData.mediaType === "image") {
      formDataToSend.append("image", file);
    }

    try {
      await axiosInstance.post("/api/projects", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percentCompleted);
        },
      });

      toast.success(
        <div className="flex items-center gap-2">
          <FaCheck className="text-green-500" />
          <span>پروژه با موفقیت ثبت شد!</span>
        </div>,
      );

      // Reset form
      resetForm();
    } catch (err) {
      console.error("Error submitting project:", err);
      toast.error(
        <div className="flex items-center gap-2">
          <FaExclamationTriangle className="text-red-500" />
          <span>خطا در ثبت پروژه</span>
        </div>,
      );
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const resetForm = () => {
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
    setSubCategories([]);
    setValidationErrors({});
  };

  const InputField = ({
    icon: Icon,
    placeholder,
    name,
    value,
    onChange,
    type = "text",
    required = false,
    error,
    ...props
  }) => (
    <div>
      <div className={`relative ${error ? "mb-1" : ""}`}>
        {Icon && (
          <div className="absolute right-3 top-3 text-gray-400">
            <Icon />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full p-3 pr-10 rounded-lg border bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-700 focus:border-blue-500"
          }`}
          required={required}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mr-1">{error}</p>}
    </div>
  );

  const SelectField = ({
    icon: Icon,
    label,
    name,
    value,
    onChange,
    children,
    required = false,
    error,
    disabled = false,
  }) => (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute right-3 top-3 text-gray-400">
            <Icon />
          </div>
        )}
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full p-3 pr-10 rounded-lg border appearance-none bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-700 focus:border-blue-500"
          } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          required={required}
        >
          {children}
        </select>
        <div className="absolute left-3 top-3 pointer-events-none">
          <MdCategory className="text-gray-400" />
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mr-1">{error}</p>}
    </div>
  );

  const TextareaField = ({
    icon: Icon,
    placeholder,
    name,
    value,
    onChange,
    rows = 3,
    error,
  }) => (
    <div>
      <div className={`relative ${error ? "mb-1" : ""}`}>
        {Icon && (
          <div className="absolute right-3 top-3 text-gray-400">
            <Icon />
          </div>
        )}
        <textarea
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className={`w-full p-3 pr-10 rounded-lg border bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-700 focus:border-blue-500"
          }`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mr-1">{error}</p>}
    </div>
  );

  return (
    <div
      className="p-4 md:p-6 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-300"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
              <FaPlus className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                افزودن پروژه جدید
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                پروژه خود را با جزئیات کامل ثبت کنید
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-blue-600 dark:text-blue-400">
                  در حال آپلود...
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* بخش اصلی فرم */}
          <div className="lg:col-span-2 space-y-6">
            {/* دسته‌بندی */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <MdCategory className="text-blue-600 dark:text-blue-400 text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">دسته‌بندی پروژه</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    دسته اصلی و زیرمجموعه را انتخاب کنید
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  icon={MdCategory}
                  label="دسته اصلی"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  error={validationErrors.categoryId}
                >
                  <option value="">انتخاب کنید...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="py-2">
                      {cat.title}
                    </option>
                  ))}
                </SelectField>

                <SelectField
                  label="زیرمجموعه"
                  name="subCategoryId"
                  value={formData.subCategoryId}
                  onChange={handleChange}
                  disabled={!formData.categoryId || subCategories.length === 0}
                >
                  <option value="">انتخاب کنید...</option>
                  {subCategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.title}
                    </option>
                  ))}
                </SelectField>
              </div>
            </div>

            {/* اطلاعات پروژه */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <FaEdit className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">اطلاعات پروژه</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    جزئیات اصلی پروژه را وارد کنید
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <InputField
                  icon={FaEdit}
                  placeholder="عنوان پروژه *"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  error={validationErrors.title}
                />
                <InputField
                  icon={FaLink}
                  placeholder="لینک مرتبط"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  error={validationErrors.link}
                />
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    icon={FaPalette}
                    placeholder="تکنیک اجرا"
                    name="technique"
                    value={formData.technique}
                    onChange={handleChange}
                  />

                  <InputField
                    icon={FaRulerCombined}
                    placeholder="ابعاد اثر"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                  />

                  <InputField
                    icon={FaBuilding}
                    placeholder="نام نمایشگاه"
                    name="exhibitionName"
                    value={formData.exhibitionName}
                    onChange={handleChange}
                  />

                  <InputField
                    icon={FaMapMarkerAlt}
                    placeholder="مکان برگزاری"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />

                  <InputField
                    icon={FaFileAlt}
                    placeholder="برگزار کننده"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                  />

                  <InputField
                    icon={FaCalendarAlt}
                    placeholder="تاریخ"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    type="date"
                  />

                  <InputField
                    icon={FaClock}
                    placeholder="مدت زمان"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                  />

                  <InputField
                    icon={FaLink}
                    placeholder="لینک مرتبط"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    error={validationErrors.link}
                  />
                </div> */}
              </div>
            </div>

            {/* توضیحات */}
            {/* <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <MdDescription className="text-green-600 dark:text-green-400 text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">توضیحات پروژه</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    درباره پروژه توضیح دهید
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <TextareaField
                  icon={FaFileAlt}
                  placeholder="توضیحات کوتاه..."
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                />

                <TextareaField
                  icon={MdDescription}
                  placeholder="توضیحات کامل..."
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleChange}
                  rows={5}
                />
              </div>
            </div> */}
          </div>

          {/* سایدبار */}
          <div className="lg:col-span-1 space-y-6">
            {/* نوع محتوا */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-6">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div
                  className={`p-2 rounded-lg ${formData.mediaType === "image" ? "bg-purple-100 dark:bg-purple-900/30" : "bg-blue-100 dark:bg-blue-900/30"}`}
                >
                  {formData.mediaType === "image" ? (
                    <FaImage className="text-purple-600 dark:text-purple-400" />
                  ) : (
                    <FaVideo className="text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {formData.mediaType === "image"
                      ? "تصویر پروژه"
                      : "ویدیو پروژه"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    محتوای بصری پروژه
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  نوع محتوا
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleChange({
                        target: { name: "mediaType", value: "image" },
                      })
                    }
                    className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition ${
                      formData.mediaType === "image"
                        ? "bg-purple-500 text-white border-purple-500"
                        : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <FaImage /> تصویر
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleChange({
                        target: { name: "mediaType", value: "video" },
                      })
                    }
                    className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition ${
                      formData.mediaType === "video"
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <FaVideo /> ویدیو
                  </button>
                </div>
              </div>

              {formData.mediaType === "image" ? (
                <>
                  <div
                    className={`mb-4 border-2 border-dashed rounded-xl transition ${
                      validationErrors.file
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-purple-500"
                    }`}
                  >
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      accept="image/*"
                    />
                    <label
                      htmlFor="file-upload"
                      className="block p-6 text-center cursor-pointer"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <FaCloudUploadAlt
                          className={`text-4xl mb-3 ${validationErrors.file ? "text-red-500" : "text-purple-500"}`}
                        />
                        <p
                          className={`font-medium ${validationErrors.file ? "text-red-600" : "text-gray-600 dark:text-gray-400"}`}
                        >
                          {validationErrors.file
                            ? "آپلود تصویر الزامی است"
                            : "برای انتخاب تصویر کلیک کنید"}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          حداکثر حجم: ۵ مگابایت
                        </p>
                      </div>
                    </label>
                  </div>

                  {preview && (
                    <div className="mb-4 relative group">
                      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="mb-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-3">
                    <FaLink className="text-blue-500 text-xl" />
                    <div>
                      <p className="font-medium text-blue-600 dark:text-blue-400">
                        لینک ویدیو
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        لینک ویدیو را در فیلد لینک وارد کنید
                      </p>
                    </div>
                  </div>

                  {formData.link && (
                    <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        پیش‌نمایش لینک:
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400 break-all">
                        {formData.link.length > 50
                          ? `${formData.link.substring(0, 50)}...`
                          : formData.link}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* دکمه ثبت */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-3 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      <FaSave className="text-lg" />
                      ثبت پروژه
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full py-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  پاک کردن فرم
                </button>
              </div>
            </div>

            {/* خلاصه فرم */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold mb-4 text-gray-700 dark:text-gray-300">
                خلاصه اطلاعات
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">
                    دسته اصلی:
                  </span>
                  <span className="font-medium">
                    {formData.categoryId
                      ? categories.find((c) => c.id == formData.categoryId)
                          ?.title
                      : "انتخاب نشده"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">
                    زیرمجموعه:
                  </span>
                  <span className="font-medium">
                    {formData.subCategoryId
                      ? subCategories.find(
                          (s) => s.id == formData.subCategoryId,
                        )?.title
                      : "انتخاب نشده"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">
                    نوع محتوا:
                  </span>
                  <span
                    className={`font-medium px-2 py-1 rounded-full text-xs ${
                      formData.mediaType === "image"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    }`}
                  >
                    {formData.mediaType === "image" ? "تصویر" : "ویدیو"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">
                    وضعیت:
                  </span>
                  <span
                    className={`font-medium px-2 py-1 rounded-full text-xs ${
                      Object.keys(validationErrors).length > 0
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    }`}
                  >
                    {Object.keys(validationErrors).length > 0
                      ? "نیاز به بررسی"
                      : "آماده ثبت"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
