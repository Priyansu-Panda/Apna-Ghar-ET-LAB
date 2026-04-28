import api from "./client";

const fallbackImage = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85";

const imageToUrl = (image) => {
  if (!image) return fallbackImage;
  if (typeof image === "string") return image;
  return image.uri || image.url || fallbackImage;
};

export const mapProperty = (property) => {
  const images = Array.isArray(property.images)
    ? property.images.map(imageToUrl)
    : [];

  const price = Number(property.price ?? property.rent ?? 0);
  const security = Number(property.security ?? property.deposit ?? 0);
  const availableRooms = Number(property.availableRooms ?? 1);

  return {
    ...property,
    id: property._id || property.id,
    title: property.title || "Untitled Property",
    type: property.type || "PG",
    location: property.location || "",
    address: property.address || "",
    occupancy: property.occupancy || "Single",
    gender: property.gender || "Any",
    price,
    rent: price,
    security,
    deposit: security,
    image: images[0] || fallbackImage,
    images: images.length > 0 ? images : [fallbackImage],
    features: property.amenities || property.features || [],
    amenities: property.amenities || property.features || [],
    availableRooms,
    status: property.status || "Available",
    furnished: property.furnished || "Fully Furnished",
    earnings: price,
    tenants: property.status === "Occupied" ? availableRooms : 0,
    owner: property.ownerId || property.owner || null,
  };
};

export const mapProperties = (properties = []) => properties.map(mapProperty);

export const getAllProperties = async () => {
  const response = await api.get("/properties");
  return mapProperties(response.data.properties);
};

export const getPropertyById = async (id) => {
  const response = await api.get(`/properties/${id}`);
  return mapProperty(response.data.property);
};

export const getMyProperties = async () => {
  const response = await api.get("/properties");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const allProps = mapProperties(response.data.properties);
  if (!user) return [];
  const userId = String(user._id || user.id || "");
  return allProps.filter(p => String(p.owner) === userId);
};

export const createProperty = async (formData) => {
  const response = await api.post("/properties", formData);
  return mapProperty(response.data.property);
};

export const updateProperty = async (id, data) => {
  const response = await api.put(`/properties/${id}`, data);
  return mapProperty(response.data.property || response.data.updatedProperty);
};

export const deleteProperty = async (id) => {
  const response = await api.delete(`/properties/${id}`);
  return response.data;
};
