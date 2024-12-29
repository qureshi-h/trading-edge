import dayjs from 'dayjs';

export const getDatesExcludingWeekends = (num: number) => {
    const dates = [];
    let currentDate = dayjs();
    while (dates.length < num) {
        if (currentDate.day() !== 0 && currentDate.day() !== 6) {
            dates.push(currentDate.format('YYYY-MM-DD'));
        }
        currentDate = currentDate.subtract(1, 'day');
    }
    return dates;
};
