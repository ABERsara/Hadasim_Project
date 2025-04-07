from checks_service import validate_data
import pandas as pd

# Calculating per-hour averages
def calc_hour_avg(df, val='value'):
    """
    Calculates the average value for each hour.
    Args:
        df (pd.DataFrame): DataFrame containing time series data with 'timestamp' and value columns.
        val (str, optional): Name of the value column. Defaults to 'value'.

    Returns:
        pd.DataFrame: DataFrame with 'Start Time' and 'Average' columns representing hourly averages.
    """
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['hour'] = df['timestamp'].dt.floor('h')  # Round down to the nearest hour
    hourly_avg = df.groupby('hour')[val].mean().reset_index()
    hourly_avg.rename(columns={'hour': 'Start Time', val: 'Average'}, inplace=True)
    return hourly_avg

# Data division and consolidation
def process_data_in_parts(file_path):
    """
    Processes the data in daily parts and combines the results.
    Args:
        file_path (str): Path to the file.

    Returns:
        pd.DataFrame: DataFrame containing the final hourly averages.
    """
    df = pd.read_csv(file_path)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['date'] = df['timestamp'].dt.date
    daily_avg = []

    for date, daily_data in df.groupby('date'):
        validated_data = validate_data(daily_data.copy())
        if not validated_data.empty:
            hourly_avg = calc_hour_avg(validated_data)
            daily_avg.append(hourly_avg)
        else:
            print(f"Skipping daily part for {date} due to validation errors.")

    return pd.concat(daily_avg)

def calc_overall_hourly_avg_from_df(df):
    """
    Calculates the average value for each hour across all dates in a DataFrame
    that contains 'Start Time' (datetime) and 'Average' columns.

    Args:
        df (pd.DataFrame): DataFrame with 'Start Time' and 'Average' columns.

    Returns:
        pd.DataFrame: DataFrame with 'Hour' and 'Average' columns representing overall hourly averages.
    """
    if 'Start Time' not in df.columns:
        raise KeyError("DataFrame must contain a 'Start Time' column.")

    df['Start Time'] = pd.to_datetime(df['Start Time'])
    df['hour'] = df['Start Time'].dt.hour
    overall_hourly_avg = df.groupby('hour')['Average'].mean().reset_index()
    overall_hourly_avg.rename(columns={'hour': 'Hour', 'Average': 'Average'}, inplace=True)
    overall_hourly_avg['Hour'] = overall_hourly_avg['Hour'].astype(int).apply(lambda x: f"{x:02d}:00")
    return overall_hourly_avg

def process_csv_file(file_path):
    """
    Processes a CSV file, validates data, and calculates hourly averages.
    Args:
        file_path (str): Path to the file.

    Returns:
        pd.DataFrame: DataFrame containing hourly averages.
    """
    try:
        df = pd.read_csv(file_path)

        validated_df = validate_data(df)

        if validated_df.empty:
            print("Data validation failed, cannot process data.")
            return pd.DataFrame()

        hourly_avg = calc_hour_avg(validated_df)
        return hourly_avg

    except FileNotFoundError:
        print(f"Error: File not found at '{file_path}'.")
        return pd.DataFrame()
    except Exception as e:
        print(f"An error occurred: {e}")
        return pd.DataFrame()

def calc_overall_hourly_avg(file_path):
    """
    Calculates the average of the value for each hour across all data in file.

    Args:
        file_path (str): Path to the file.

    Returns:
        pd.DataFrame: DataFrame containing the hourly averages (across all days).
    """
    try:
        df = pd.read_csv(file_path)

        validated_df = validate_data(df.dropna().copy())

        if validated_df.empty:
            print("Data validation failed, cannot calculate overall hourly averages.")
            return pd.DataFrame()

        validated_df['hour'] = validated_df['timestamp'].dt.hour

        overall_avg = validated_df.groupby('hour')['value'].mean().reset_index()
        overall_avg.rename(columns={'hour': 'Hour', 'value': 'Average'}, inplace=True)
        overall_avg['Hour'] = overall_avg['Hour'].astype(int).apply(lambda x: f"{x:02d}:00")

        return overall_avg

    except FileNotFoundError:
        print(f"Error: File not found at '{file_path}'.")
        return pd.DataFrame()
    except Exception as e:
        print(f"An error occurred: {e}")
        return pd.DataFrame()

def save_to_csv(hourly_avg_df, output_file_path):
    """
    Saves a DataFrame containing hourly averages to a CSV file.

    Args:
        hourly_avg_df (pd.DataFrame): DataFrame with 'Start Time' and 'Average' columns.
        output_file_path (str): Path to the CSV file where the data will be saved.

    Returns:
        None
    """
    try:
        hourly_avg_df.to_csv(output_file_path, index=False)
    except Exception as e:
        print(f"An error occurred while saving to CSV: {e}")


# Parquet format support
def process_data(file_path):
    """
    Processes time series data from CSV or Parquet files.
    args:
        file_path (str): Path to the data file (CSV or Parquet).

    returns:
        pd.DataFrame: DataFrame containing hourly averages.
    """
    file_type = None
    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path)
        file_type = 'csv'
    elif file_path.endswith('.parquet'):
        df = pd.read_parquet(file_path, engine='pyarrow')
        file_type = 'parquet'
    else:
        raise ValueError("Unsupported file format. Only CSV and Parquet are supported.")

    validated_df = validate_data(df, file_type=file_type)

    if validated_df.empty:
        print("Data Validation failed, returning empty dataframe.")
        return pd.DataFrame()

    return calc_hour_avg(validated_df, val='mean_value' if file_type == 'parquet' else 'value')

#
# יתרונות בשימוש בפורמט Parquet:
# דחיסה יעילה: משתמש בטכניקות דחיסה מתקדמות, שמפחיתות משמעותית את גודל הקובץ.
# שאילתות מהירות: ניתן לאחזר רק את העמודות הרלוונטיות, מה שמאיץ שאילתות.
# ביצועים גבוהים: פורמט אופטימלי לעיבוד נתונים אנליטיים.
# סכימה מוטבעת: סכימת הנתונים metadata מאוחסנת יחד עם הנתונים, מה שמבטיח קריאות ואימות נתונים. כולל מידע על סוגי העמודות והמבנה של הנתונים – מה שמקל על שילוב עם מערכות שונות, וגם מאפשר גמישות בהוספה או שינוי של שדות בעתיד.
# כתמיכה במבני נתונים מורכבים: מתמודד עם סוגי מידע מורכבים כמו מערכים, JSON ותאריכים
#   תאימות: נתמך בשפות תכנות רבות, וגם משתלב בצורה חלקה עם מגוון כלים (pandas, Spark ועוד)
#  קוד פתוח, כך שניתן לעבוד איתו באופן חופשי, ללא תלות בחברה מסוימת.