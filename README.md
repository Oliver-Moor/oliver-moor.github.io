# The Pregnant Nerd - Statistical Contraction Timer

A sophisticated contraction timer web app that uses statistical analysis to predict birth timing through standard deviation convergence.

## 🎯 Core Features

### 1. Simple, High-Stress Interface
- **Big Button Design**: One large button to start/stop contractions
- **High Contrast**: Black background with white text for maximum visibility
- **Real-time Timer**: Live display of current contraction duration

### 2. Comprehensive Statistics
- **Last Duration**: Most recent contraction length
- **Frequency**: Time between contractions
- **Rolling Averages**: Automatic calculation for last 30 minutes and 1 hour
- **Custom Windows**: Calculate averages for any time period

### 3. Statistical Prediction Engine (The Secret Sauce)
The app analyzes contraction regularity to predict when labor will become perfectly regular:
- Calculates **Standard Deviation** of contraction lengths over sliding windows
- Performs **Linear Regression** on SD convergence
- Predicts the **exact time** when SD reaches zero (perfect regularity)
- Displays **confidence level** based on R-squared value

### 4. Visual Analysis
- **Scatter Plot**: Shows all contractions over time
- **Envelope Lines**: Visual representation of SD convergence
- **Interactive Chart**: Real-time updates as new contractions are added

### 5. Data Management
- **Local Storage**: All data saved in browser (no server needed)
- **Edit/Delete**: Remove false alarms or mistakes
- **CSV Export**: One-click export for analysis in Excel or other tools
- **Clear All**: Option to reset and start fresh

## 📊 How the Prediction Works

The app is based on the hypothesis that birth occurs when contractions become perfectly predictable (standard deviation ≈ 0):

1. **Calculate Duration**: For each contraction, record start and end time
2. **Sliding Window Analysis**: Group contractions into windows of 10
3. **Standard Deviation**: Calculate SD for each window
4. **Linear Regression**: Find the rate at which SD is decreasing
5. **Predict Zero Point**: Solve for when SD = 0 using the regression line
6. **Display Time**: Show the predicted time of "perfect regularity"

## 🚀 Getting Started

### Installation
No installation required! Simply open `index.html` in a modern web browser.

### Usage
1. **Start**: Press the big button when a contraction begins
2. **Stop**: Press again when the contraction ends
3. **Review**: Check statistics and predictions in real-time
4. **Export**: Share data with medical professionals via CSV export

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- LocalStorage enabled (for data persistence)

## 📱 Responsive Design
The app works on:
- Desktop computers
- Tablets
- Mobile phones (optimized for one-handed use)

## 🔒 Privacy
- All data stored locally in your browser
- No server communication
- No data collection or tracking
- Complete privacy during your labor

## 📈 Technical Details

### Data Structure
Each contraction is stored as:
```javascript
{
  startTime: timestamp,
  endTime: timestamp
}
```

### Statistics Calculated
- **Duration**: `endTime - startTime`
- **Frequency**: Time between start of consecutive contractions
- **Standard Deviation**: `sqrt(variance)` of duration
- **Linear Regression**: Least squares method on SD over time
- **R-squared**: Confidence metric for prediction quality

### Prediction Algorithm
```
1. Group contractions into windows of 10
2. Calculate SD for each window
3. Plot SD vs. time
4. Perform linear regression: y = mx + b
5. Solve for x when y = 0: x = -b/m
6. Display predicted time
```

## 🎨 Customization
The app uses CSS variables for easy customization. Edit `styles.css` to change:
- Color scheme
- Button size
- Font sizes
- Layout spacing

## 🤝 Contributing
This is a personal project, but suggestions are welcome!

## ⚠️ Medical Disclaimer
This app is for informational purposes only. It is not a medical device and should not replace professional medical advice. Always consult with your healthcare provider and follow their guidance during labor.

## 📝 License
MIT License - Feel free to use and modify for personal use.

## 🙏 Credits
Inspired by the concept that birth timing can be predicted through statistical analysis of contraction regularity.

---

**Built with ❤️ for data-driven parents**

