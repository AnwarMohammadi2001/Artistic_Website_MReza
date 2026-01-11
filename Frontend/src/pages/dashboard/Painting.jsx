import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  CircularProgress,
  Tab,
  Tabs,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Badge,
  Tooltip,
  Fab,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Category as CategoryIcon,
  Folder as FolderIcon,
  Collections as CollectionsIcon,
  Palette as PaletteIcon,
  ViewList as ViewListIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

// Alert component for Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Painting = () => {
  // State management
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  // Forms state
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    icon: "🎨",
  });
  const [subCategoryForm, setSubCategoryForm] = useState({
    name: "",
    description: "",
    categoryId: "",
  });
  const [itemForm, setItemForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    subCategoryId: "",
    customFields: {},
    featuredImage: null,
    additionalImages: [],
  });

  // Fields state
  const [categoryFields, setCategoryFields] = useState([]);
  const [subCategoryFields, setSubCategoryFields] = useState([]);
  const [allFields, setAllFields] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [openSubCategoryDialog, setOpenSubCategoryDialog] = useState(false);
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [fieldDialog, setFieldDialog] = useState({
    open: false,
    targetType: "",
    targetId: "",
  });
  const [newField, setNewField] = useState({
    name: "",
    label: "",
    type: "text",
    required: false,
    options: [],
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // 📌 Stepper steps
  const steps = ["کتگوری‌ها", "ساب‌کتگوری‌ها", "آثار", "پیش‌نمایش"];

  // Token (در حالت واقعی از localStorage یا context می‌آید)
  const getToken = () => localStorage.getItem("token") || "demo-token";

  // 📌 نمایش اسنک‌بار
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // 📌 دریافت همه کتگوری‌ها
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/categories`);
      // مطمئن شویم که response.data یک آرایه است
      setCategories(Array.isArray(response.data) ? response.data : []);
      setError("");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError("خطا در دریافت کتگوری‌ها: " + errorMessage);
      setCategories([]); // در صورت خطا، آرایه خالی قرار بده
    } finally {
      setLoading(false);
    }
  };

  // 📌 دریافت ساب‌کتگوری‌های یک کتگوری
  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await axios.get(
        `${API_URL}/subcategories/category/${categoryId}`
      );
      setSubCategories(Array.isArray(response.data) ? response.data : []);
      setSelectedCategory(categoryId);
      setActiveTab(1);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError("خطا در دریافت ساب‌کتگوری‌ها: " + errorMessage);
      setSubCategories([]);
    }
  };

  // 📌 دریافت آیتم‌های یک ساب‌کتگوری
  const fetchItems = async (subCategoryId) => {
    try {
      const response = await axios.get(
        `${API_URL}/items/subcategory/${subCategoryId}`
      );
      setItems(Array.isArray(response.data.items) ? response.data.items : []);
      setSelectedSubCategory(subCategoryId);
      setActiveTab(2);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError("خطا در دریافت آیتم‌ها: " + errorMessage);
      setItems([]);
    }
  };

  // 📌 دریافت فیلدهای ساب‌کتگوری برای فرم داینامیک
  const fetchFields = async (subCategoryId) => {
    try {
      const response = await axios.get(
        `${API_URL}/subcategories/${subCategoryId}/fields`
      );
      setAllFields(
        Array.isArray(response.data.allFields) ? response.data.allFields : []
      );
    } catch (err) {
      console.error("خطا در دریافت فیلدها:", err);
      setAllFields([]);
    }
  };

  // 📌 ایجاد کتگوری جدید
  const handleCreateCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/categories`, categoryForm, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      showSnackbar("کتگوری با موفقیت ایجاد شد");
      setOpenCategoryDialog(false);
      setCategoryForm({ name: "", description: "", icon: "🎨" });
      fetchCategories();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      showSnackbar("خطا در ایجاد کتگوری: " + errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // 📌 ایجاد ساب‌کتگوری جدید
  const handleCreateSubCategory = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/subcategories`, subCategoryForm, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      showSnackbar("ساب‌کتگوری با موفقیت ایجاد شد");
      setOpenSubCategoryDialog(false);
      setSubCategoryForm({ name: "", description: "", categoryId: "" });
      fetchSubCategories(subCategoryForm.categoryId);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      showSnackbar("خطا در ایجاد ساب‌کتگوری: " + errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // 📌 ایجاد آیتم جدید
  const handleCreateItem = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", itemForm.title);
      formData.append("description", itemForm.description);
      formData.append("categoryId", itemForm.categoryId);
      formData.append("subCategoryId", itemForm.subCategoryId);

      // اضافه کردن فیلدهای سفارشی
      Object.keys(itemForm.customFields).forEach((key) => {
        formData.append(`customFields[${key}]`, itemForm.customFields[key]);
      });

      // اضافه کردن تصاویر
      if (itemForm.featuredImage) {
        formData.append("featuredImage", itemForm.featuredImage);
      }

      itemForm.additionalImages.forEach((image, index) => {
        formData.append("additionalImages", image);
      });

      await axios.post(`${API_URL}/items`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });

      showSnackbar("آیتم با موفقیت ایجاد شد");
      setOpenItemDialog(false);
      setItemForm({
        title: "",
        description: "",
        categoryId: "",
        subCategoryId: "",
        customFields: {},
        featuredImage: null,
        additionalImages: [],
      });
      fetchItems(itemForm.subCategoryId);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      showSnackbar("خطا در ایجاد آیتم: " + errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // 📌 حذف کتگوری
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("آیا از حذف این کتگوری مطمئن هستید؟")) return;

    try {
      await axios.delete(`${API_URL}/categories/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      showSnackbar("کتگوری با موفقیت حذف شد");
      fetchCategories();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      showSnackbar("خطا در حذف کتگوری: " + errorMessage, "error");
    }
  };

  // 📌 حذف ساب‌کتگوری
  const handleDeleteSubCategory = async (id) => {
    if (!window.confirm("آیا از حذف این ساب‌کتگوری مطمئن هستید؟")) return;

    try {
      await axios.delete(`${API_URL}/subcategories/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      showSnackbar("ساب‌کتگوری با موفقیت حذف شد");
      fetchSubCategories(selectedCategory);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      showSnackbar("خطا در حذف ساب‌کتگوری: " + errorMessage, "error");
    }
  };

  // 📌 مدیریت تغییرات فرم آیتم
  const handleItemFormChange = (field, value) => {
    if (field.startsWith("custom_")) {
      const fieldName = field.replace("custom_", "");
      setItemForm((prev) => ({
        ...prev,
        customFields: {
          ...prev.customFields,
          [fieldName]: value,
        },
      }));
    } else {
      setItemForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  // 📌 مدیریت فایل‌ها
  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    if (field === "featuredImage") {
      setItemForm((prev) => ({ ...prev, featuredImage: files[0] }));
    } else if (field === "additionalImages") {
      setItemForm((prev) => ({ ...prev, additionalImages: files }));
    }
  };

  // 📌 بازگشت به مرحله قبل
  const handleBack = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
      if (activeTab === 2) {
        setSelectedSubCategory(null);
        setItems([]);
      } else if (activeTab === 1) {
        setSelectedCategory(null);
        setSubCategories([]);
      }
    }
  };

  // 📌 اولیه‌سازی
  useEffect(() => {
    fetchCategories();
  }, []);

  // 📌 زمانی که ساب‌کتگوری تغییر می‌کند، فیلدهای آن را دریافت کن
  useEffect(() => {
    if (itemForm.subCategoryId) {
      fetchFields(itemForm.subCategoryId);
    }
  }, [itemForm.subCategoryId]);

  // 📌 پیش‌نمایش آیکون‌های کتگوری
  const categoryIcons = ["🎨", "🖼️", "📐", "🎭", "🏛️", "📷", "🎪", "🌟"];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* هدر با گرادیانت */}
      <Paper
        elevation={3}
        sx={{
          mb: 4,
          p: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <PaletteIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                گالری هنری TET
              </Typography>
              <Typography variant="subtitle1">
                مدیریت آثار هنری به صورت سلسله‌مراتبی
              </Typography>
            </Box>
          </Box>

          <Fab
            color="primary"
            variant="extended"
            onClick={() => setOpenItemDialog(true)}
            disabled={!selectedSubCategory}
            sx={{ color: "white" }}
          >
            <AddIcon sx={{ mr: 1 }} />
            افزودن اثر جدید
          </Fab>
        </Box>
      </Paper>

      {/* Stepper برای نمایش مراحل */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Stepper activeStep={activeTab} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    color: activeTab >= index ? "#667eea" : "grey.300",
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* دکمه بازگشت */}
      {activeTab > 0 && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          بازگشت
        </Button>
      )}

      {/* تب‌های اصلی */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab
            icon={<CategoryIcon />}
            label={
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2">کتگوری‌ها</Typography>
                <Typography variant="caption">
                  {categories.length} مورد
                </Typography>
              </Box>
            }
          />
          <Tab
            icon={<FolderIcon />}
            label={
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2">ساب‌کتگوری‌ها</Typography>
                <Typography variant="caption">
                  {selectedCategory ? `${subCategories.length} مورد` : "---"}
                </Typography>
              </Box>
            }
            disabled={!selectedCategory}
          />
          <Tab
            icon={<CollectionsIcon />}
            label={
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2">آثار</Typography>
                <Typography variant="caption">
                  {selectedSubCategory ? `${items.length} مورد` : "---"}
                </Typography>
              </Box>
            }
            disabled={!selectedSubCategory}
          />
        </Tabs>
      </Paper>

      {/* محتوای تب‌ها */}
      <Box sx={{ mt: 3 }}>
        {/* تب کتگوری‌ها */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {/* دکمه افزودن کتگوری */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 3,
                  cursor: "pointer",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
                onClick={() => setOpenCategoryDialog(true)}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "primary.light",
                    mb: 2,
                  }}
                >
                  <AddIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6" color="primary">
                  افزودن کتگوری جدید
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mt: 1 }}
                >
                  شروع با ایجاد اولین کتگوری
                </Typography>
              </Card>
            </Grid>

            {/* لیست کتگوری‌ها */}
            {loading ? (
              <Grid item xs={12}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  minHeight="200px"
                >
                  <CircularProgress />
                </Box>
              </Grid>
            ) : categories.length === 0 ? (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: "center" }}>
                  <CategoryIcon
                    sx={{ fontSize: 60, color: "grey.400", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    هنوز کتگوری‌ای ایجاد نشده است
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenCategoryDialog(true)}
                    sx={{ mt: 2 }}
                  >
                    ایجاد اولین کتگوری
                  </Button>
                </Paper>
              </Grid>
            ) : (
              categories.map((category) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 40,
                            height: 40,
                            mr: 2,
                          }}
                        >
                          {category.icon || "🎨"}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" component="div">
                            {category.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {category.id}
                          </Typography>
                        </Box>
                        <Chip
                          label={category.SubCategories?.length || 0}
                          size="small"
                          color="secondary"
                          icon={<FolderIcon />}
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {category.description || "بدون توضیحات"}
                      </Typography>
                    </CardContent>

                    <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                      <Tooltip title="مشاهده ساب‌کتگوری‌ها">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => fetchSubCategories(category.id)}
                          startIcon={<ViewListIcon />}
                        >
                          مشاهده
                        </Button>
                      </Tooltip>
                      <Box>
                        <Tooltip title="حذف">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}

        {/* تب ساب‌کتگوری‌ها */}
        {activeTab === 1 && (
          <Grid container spacing={3}>
            {/* دکمه افزودن ساب‌کتگوری */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 3,
                  cursor: "pointer",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
                onClick={() => setOpenSubCategoryDialog(true)}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "secondary.light",
                    mb: 2,
                  }}
                >
                  <AddIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6" color="secondary">
                  افزودن ساب‌کتگوری
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mt: 1 }}
                >
                  برای کتگوری انتخاب شده
                </Typography>
              </Card>
            </Grid>

            {/* لیست ساب‌کتگوری‌ها */}
            {subCategories.length === 0 ? (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: "center" }}>
                  <FolderIcon sx={{ fontSize: 60, color: "grey.400", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    هنوز ساب‌کتگوری‌ای ایجاد نشده است
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenSubCategoryDialog(true)}
                    sx={{ mt: 2 }}
                  >
                    ایجاد اولین ساب‌کتگوری
                  </Button>
                </Paper>
              </Grid>
            ) : (
              subCategories.map((subCategory) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={subCategory.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "secondary.main",
                            width: 40,
                            height: 40,
                            mr: 2,
                          }}
                        >
                          <FolderIcon />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" component="div">
                            {subCategory.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {subCategory.Category?.name}
                          </Typography>
                        </Box>
                        <Chip
                          label={subCategory.itemCount || 0}
                          size="small"
                          color="primary"
                          icon={<CollectionsIcon />}
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {subCategory.description || "بدون توضیحات"}
                      </Typography>
                    </CardContent>

                    <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                      <Tooltip title="مشاهده آثار">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => fetchItems(subCategory.id)}
                          startIcon={<ViewListIcon />}
                        >
                          مشاهده آثار
                        </Button>
                      </Tooltip>
                      <Box>
                        <Tooltip title="حذف">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDeleteSubCategory(subCategory.id)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}

        {/* تب آثار */}
        {activeTab === 2 && (
          <Grid container spacing={3}>
            {/* دکمه افزودن اثر */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 3,
                  cursor: "pointer",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
                onClick={() => setOpenItemDialog(true)}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "success.light",
                    mb: 2,
                  }}
                >
                  <AddPhotoIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6" color="success.main">
                  افزودن اثر جدید
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mt: 1 }}
                >
                  در ساب‌کتگوری انتخاب شده
                </Typography>
              </Card>
            </Grid>

            {/* لیست آثار */}
            {items.length === 0 ? (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: "center" }}>
                  <CollectionsIcon
                    sx={{ fontSize: 60, color: "grey.400", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    هنوز اثری ایجاد نشده است
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenItemDialog(true)}
                    sx={{ mt: 2 }}
                  >
                    ایجاد اولین اثر
                  </Button>
                </Paper>
              </Grid>
            ) : (
              items.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 200,
                        position: "relative",
                        backgroundImage: `url(${
                          item.Media?.[0]?.path
                            ? `${API_URL}${item.Media[0].path}`
                            : "https://via.placeholder.com/300x200?text=بدون+تصویر"
                        })`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "rgba(0,0,0,0.5)",
                          color: "white",
                          borderRadius: 1,
                          p: 0.5,
                        }}
                      >
                        <StarIcon
                          sx={{ fontSize: 16, verticalAlign: "middle" }}
                        />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          ویژه
                        </Typography>
                      </Box>
                    </Box>

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div" gutterBottom>
                        {item.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.description || "بدون توضیحات"}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          mt: 1,
                        }}
                      >
                        {Object.entries(item.customFields || {})
                          .slice(0, 2)
                          .map(([key, value]) => (
                            <Chip
                              key={key}
                              label={`${key}: ${value}`}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        {Object.keys(item.customFields || {}).length > 2 && (
                          <Chip
                            label={`+${
                              Object.keys(item.customFields || {}).length - 2
                            }`}
                            size="small"
                          />
                        )}
                      </Box>
                    </CardContent>

                    <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
                      <Tooltip title="حذف">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Box>

      {/* دیالوگ ایجاد کتگوری */}
      <Dialog
        open={openCategoryDialog}
        onClose={() => setOpenCategoryDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <CategoryIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          ایجاد کتگوری جدید
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              label="نام کتگوری"
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, name: e.target.value })
              }
              fullWidth
              required
              autoFocus
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                انتخاب آیکون
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {categoryIcons.map((icon) => (
                  <IconButton
                    key={icon}
                    onClick={() => setCategoryForm({ ...categoryForm, icon })}
                    sx={{
                      border:
                        categoryForm.icon === icon
                          ? "2px solid #1976d2"
                          : "1px solid #e0e0e0",
                      fontSize: "24px",
                    }}
                  >
                    {icon}
                  </IconButton>
                ))}
              </Box>
            </Box>

            <TextField
              label="توضیحات"
              value={categoryForm.description}
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  description: e.target.value,
                })
              }
              fullWidth
              multiline
              rows={3}
              placeholder="توضیحاتی درباره این کتگوری وارد کنید..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoryDialog(false)} color="inherit">
            لغو
          </Button>
          <Button
            onClick={handleCreateCategory}
            variant="contained"
            disabled={!categoryForm.name || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          >
            {loading ? "در حال ایجاد..." : "ایجاد کتگوری"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* دیالوگ ایجاد ساب‌کتگوری */}
      <Dialog
        open={openSubCategoryDialog}
        onClose={() => setOpenSubCategoryDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <FolderIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          ایجاد ساب‌کتگوری جدید
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>کتگوری والد</InputLabel>
              <Select
                value={subCategoryForm.categoryId}
                onChange={(e) =>
                  setSubCategoryForm({
                    ...subCategoryForm,
                    categoryId: e.target.value,
                  })
                }
                label="کتگوری والد"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="نام ساب‌کتگوری"
              value={subCategoryForm.name}
              onChange={(e) =>
                setSubCategoryForm({ ...subCategoryForm, name: e.target.value })
              }
              fullWidth
              required
            />

            <TextField
              label="توضیحات"
              value={subCategoryForm.description}
              onChange={(e) =>
                setSubCategoryForm({
                  ...subCategoryForm,
                  description: e.target.value,
                })
              }
              fullWidth
              multiline
              rows={3}
              placeholder="توضیحاتی درباره این ساب‌کتگوری وارد کنید..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenSubCategoryDialog(false)}
            color="inherit"
          >
            لغو
          </Button>
          <Button
            onClick={handleCreateSubCategory}
            variant="contained"
            disabled={
              !subCategoryForm.name || !subCategoryForm.categoryId || loading
            }
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          >
            {loading ? "در حال ایجاد..." : "ایجاد ساب‌کتگوری"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar برای نمایش پیام‌ها */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Painting;
