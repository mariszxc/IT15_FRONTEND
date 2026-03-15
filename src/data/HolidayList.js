const toDateKey = (year, month, day) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const formatDateLabel = (dateKey) =>
  new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const getEasterSunday = (year) => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
};

const getNationalHeroesDay = (year) => {
  const lastDayOfAugust = new Date(year, 7, 31);
  const dayOfWeek = lastDayOfAugust.getDay();
  const offset = dayOfWeek === 1 ? 0 : dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  return new Date(year, 7, 31 - offset);
};

const FIXED_HOLIDAYS = [
  {
    month: 1,
    day: 1,
    name: "New Year's Day",
    type: "regular",
    description: "First day of the Gregorian calendar year.",
  },
  {
    month: 2,
    day: 25,
    name: "EDSA People Power Revolution Anniversary",
    type: "special-non-working",
    description: "Commemorates the 1986 EDSA People Power Revolution.",
  },
  {
    month: 4,
    day: 9,
    name: "Araw ng Kagitingan",
    type: "regular",
    description: "Day of Valor honoring Filipino war heroes.",
  },
  {
    month: 5,
    day: 1,
    name: "Labor Day",
    type: "regular",
    description: "National holiday celebrating workers and labor rights.",
  },
  {
    month: 6,
    day: 12,
    name: "Independence Day",
    type: "regular",
    description: "Celebrates Philippine independence from Spain in 1898.",
  },
  {
    month: 8,
    day: 21,
    name: "Ninoy Aquino Day",
    type: "special-non-working",
    description: "Commemorates the assassination of Senator Benigno Aquino Jr.",
  },
  {
    month: 11,
    day: 1,
    name: "All Saints' Day",
    type: "special-non-working",
    description: "Day for honoring saints and remembering departed loved ones.",
  },
  {
    month: 11,
    day: 30,
    name: "Bonifacio Day",
    type: "regular",
    description: "Honors Andres Bonifacio, one of the heroes of Philippine independence.",
  },
  {
    month: 12,
    day: 25,
    name: "Christmas Day",
    type: "regular",
    description: "National holiday celebrating Christmas.",
  },
  {
    month: 12,
    day: 30,
    name: "Rizal Day",
    type: "regular",
    description: "Commemorates Dr. Jose Rizal, the Philippine national hero.",
  },
];

export const getPhilippineHolidays = (year) => {
  const easterSunday = getEasterSunday(year);
  const maundyThursday = new Date(easterSunday);
  maundyThursday.setDate(easterSunday.getDate() - 3);
  const goodFriday = new Date(easterSunday);
  goodFriday.setDate(easterSunday.getDate() - 2);
  const nationalHeroesDay = getNationalHeroesDay(year);

  const dynamicHolidays = [
    {
      date: toDateKey(
        maundyThursday.getFullYear(),
        maundyThursday.getMonth() + 1,
        maundyThursday.getDate()
      ),
      name: "Maundy Thursday",
      type: "regular",
      description: "Observed during Holy Week.",
    },
    {
      date: toDateKey(goodFriday.getFullYear(), goodFriday.getMonth() + 1, goodFriday.getDate()),
      name: "Good Friday",
      type: "regular",
      description: "Observed during Holy Week.",
    },
    {
      date: toDateKey(
        nationalHeroesDay.getFullYear(),
        nationalHeroesDay.getMonth() + 1,
        nationalHeroesDay.getDate()
      ),
      name: "National Heroes Day",
      type: "regular",
      description: "Observed every last Monday of August.",
    },
  ];

  const fixedHolidays = FIXED_HOLIDAYS.map((holiday) => ({
    date: toDateKey(year, holiday.month, holiday.day),
    name: holiday.name,
    type: holiday.type,
    description: holiday.description,
  }));

  return [...fixedHolidays, ...dynamicHolidays]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((holiday) => ({
      ...holiday,
      dateLabel: formatDateLabel(holiday.date),
    }));
};
