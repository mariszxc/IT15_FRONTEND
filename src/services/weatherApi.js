import api from "./api";

const iconMap = {
	sun: "01d",
	"cloud-sun": "02d",
	cloud: "03d",
	"cloud-fog": "50d",
	"cloud-drizzle": "09d",
	"cloud-rain": "10d",
	"cloud-snow": "13d",
	"cloud-lightning": "11d",
};

const normalizeParams = (params = {}) => {
	const { lat, lon, ...rest } = params;

	return {
		...rest,
		...(lat != null ? { latitude: lat } : {}),
		...(lon != null ? { longitude: lon } : {}),
	};
};

const normalizeCurrent = (payload = {}) => {
	const iconKey = payload.current?.weather?.icon;

	return {
		name: payload.location?.name || "Selected location",
		weather: [
			{
				description: payload.current?.weather?.description || "Unknown",
				icon: iconMap[iconKey] || "03d",
			},
		],
		main: {
			temp: payload.current?.temperature ?? 0,
			humidity: payload.current?.humidity ?? 0,
		},
		wind: {
			speed: payload.current?.wind_speed ?? 0,
		},
	};
};

const normalizeForecast = (payload = {}) => {
	const list = (payload.forecast || []).map((day, index) => ({
		dt: index + 1,
		dt_txt: `${day.date} 12:00:00`,
		main: {
			temp: day.temperature_max ?? day.temperature_min ?? 0,
		},
		weather: [
			{
				description: day.weather?.description || "Unknown",
				icon: iconMap[day.weather?.icon] || "03d",
			},
		],
	}));

	return { list };
};

export const fetchCurrentWeather = async (params) => {
	const response = await api.get("/weather/current", { params: normalizeParams(params) });
	return { ...response, data: normalizeCurrent(response.data) };
};

export const fetchForecast = async (params) => {
	const response = await api.get("/weather/forecast", { params: normalizeParams(params) });
	return { ...response, data: normalizeForecast(response.data) };
};
