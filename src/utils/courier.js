// ============================================================
// COURIER PARTNERS & LIVE TRACKING UTILITIES
// Respected Indian Logistics Providers:
// - Blue Dart Express
// - The Professional Couriers
// - ST Courier
// - Delhivery
// - DTDC Express
// ============================================================

export const COURIER_PARTNERS = [
  {
    id: "bluedart",
    name: "Blue Dart Express",
    shortCode: "BD",
    portalUrl: "https://www.bluedart.com",
    trackingUrl: (trackNo) =>
      `https://www.bluedart.com/tracking?trackNumber=${encodeURIComponent(trackNo)}`,
    samplePrefix: "BD-",
    customerCare: "1860 233 1234",
    badgeBg: "bg-blue-900 text-white",
  },
  {
    id: "professional",
    name: "The Professional Couriers",
    shortCode: "TPC",
    portalUrl: "https://www.tpcindia.com",
    trackingUrl: (trackNo) =>
      `https://www.tpcindia.com/track?consignment=${encodeURIComponent(trackNo)}`,
    samplePrefix: "TPC-",
    customerCare: "080 2222 2222",
    badgeBg: "bg-[#800020] text-white",
  },
  {
    id: "stcourier",
    name: "ST Courier",
    shortCode: "ST",
    portalUrl: "https://stcourier.com",
    trackingUrl: (trackNo) =>
      `https://stcourier.com/track/consignment?awb=${encodeURIComponent(trackNo)}`,
    samplePrefix: "ST-",
    customerCare: "044 4000 5000",
    badgeBg: "bg-emerald-800 text-white",
  },
  {
    id: "delhivery",
    name: "Delhivery",
    shortCode: "DLV",
    portalUrl: "https://www.delhivery.com",
    trackingUrl: (trackNo) =>
      `https://www.delhivery.com/track/package/${encodeURIComponent(trackNo)}`,
    samplePrefix: "DLV-",
    customerCare: "0124 6719500",
    badgeBg: "bg-red-700 text-white",
  },
  {
    id: "dtdc",
    name: "DTDC Express",
    shortCode: "DTDC",
    portalUrl: "https://www.dtdc.in",
    trackingUrl: (trackNo) =>
      `https://www.dtdc.in/tracking/shipment-tracking.asp?trackingNumber=${encodeURIComponent(trackNo)}`,
    samplePrefix: "DTDC-",
    customerCare: "080 2536 5032",
    badgeBg: "bg-indigo-900 text-white",
  },
];

// Helper to find courier info by name or ID
export const findCourier = (carrierName = "") => {
  if (!carrierName) return COURIER_PARTNERS[0];
  const clean = carrierName.toLowerCase().trim();

  return (
    COURIER_PARTNERS.find(
      (c) =>
        c.id === clean ||
        c.name.toLowerCase() === clean ||
        clean.includes(c.id) ||
        clean.includes(c.name.toLowerCase()) ||
        c.name.toLowerCase().includes(clean)
    ) || COURIER_PARTNERS[0]
  );
};

// Generate direct external tracking portal link
export const getCourierTrackingUrl = (carrierName, trackingNumber) => {
  const courier = findCourier(carrierName);
  if (!trackingNumber) return courier.portalUrl;
  return courier.trackingUrl(trackingNumber);
};

// Generate realistic tracking number for a courier
export const generateTrackingNumber = (carrierName) => {
  const courier = findCourier(carrierName);
  const randomNum = Math.floor(1000000 + Math.random() * 9000000);
  return `${courier.samplePrefix}${randomNum}`;
};

// Next delivery status stepper
export const getNextDeliveryStatus = (currentStatus) => {
  switch (currentStatus) {
    case "Order Confirmed":
      return "Packed";
    case "Packed":
      return "Package Shipped";
    case "Package Shipped":
      return "Out for Delivery";
    case "Out for Delivery":
      return "Delivered";
    default:
      return currentStatus;
  }
};
