import api from "./api";
import axios from "axios";

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

const backendApiBase = (() => {
	const backend = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "");
	if (backend) {
		return `${backend}/api`;
	}

	return "http://127.0.0.1:8000/api";
})();

const requestForecastPayload = async (params) => {
	const normalized = normalizeParams(params);

	try {
		return await api.get("/weather/forecast", { params: normalized });
	} catch (error) {
		const shouldRetryDirect = !error.response || error.code === "ERR_NETWORK" || error.response?.status === 404;

		if (!shouldRetryDirect) {
			throw error;
		}

		return axios.get(`${backendApiBase}/weather/forecast`, {
			params: normalized,
			timeout: 15000,
			headers: {
				Accept: "application/json",
			},
		});
	}
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
	const response = await requestForecastPayload(params);
	return { ...response, data: normalizeForecast(response.data) };
};

export const fetchWeatherBundle = async (params) => {
	const response = await requestForecastPayload(params);

	return {
		...response,
		data: {
			current: normalizeCurrent(response.data),
			forecast: normalizeForecast(response.data),
		},
	};
};
