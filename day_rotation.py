import datetime

start = datetime.date(2023, 9, 6)
end = datetime.date(2024, 6, 27)
ls_year = datetime.date(2023, 6, 1)
ls_year_end = datetime.date(2023, 6, 30)
current = datetime.date.today()

holidays = {
    datetime.date(2023, 9, 22): "Pro-D Day",
    datetime.date(2023, 10, 2): "Truth and Reconciliation Day",
    datetime.date(2023, 10, 9): "Thanksgiving Day",
    datetime.date(2023, 10, 20): "Pro-D Day",
    datetime.date(2023, 11, 10): "School Closure Day",
    datetime.date(2023, 11, 13): "Remembrance Day",
    datetime.date(2023, 11, 17): "Pro-D Day",
    datetime.date(2024, 2, 19): "Family Day",
    datetime.date(2024, 2, 23): "Pro-D Day",
    datetime.date(2024, 3, 29): "Good Friday",
    datetime.date(2024, 4, 1): "Easter Monday",
    datetime.date(2024, 4, 19): "Pro-D Day",
    datetime.date(2024, 5, 20): "Victoria Day",
    datetime.date(2024, 6, 7): "Pro-D Day"
}

w_break_start = datetime.date(2023, 12, 23)
w_break_end = datetime.date(2024, 1, 7)
s_break_start = datetime.date(2024, 3, 16)
s_break_end = datetime.date(2024, 3, 28)

for i in range((w_break_end - w_break_start).days + 1): holidays[w_break_start + datetime.timedelta(days = i)] = "Winter Break"
for i in range((s_break_end - s_break_start).days + 1): holidays[s_break_start + datetime.timedelta(days = i)] = "Spring Break"

print(current)

if current == datetime.date(2023, 9, 5): print("Back to School!")
elif current < datetime.date(2023, 9, 5):
    if current < ls_year_end:
        day_n = (current - start).days % 2
        print("Day 1" if day_n == 0 else "Day 2")
    else: print("Enjoy Summer!")
elif current in holidays: print(holidays[current])
elif current.weekday() >= 5: print("Weekend")
elif current > end: print("Have a Good Summer!")
else:
    total_days = (current - start).days - sum(1 for holiday in holidays if holiday < current)
    day_n = total_days % 2
    print("Day 1" if day_n == 0 else "Day 2")
