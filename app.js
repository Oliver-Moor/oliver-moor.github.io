// =======================
// STATE MANAGEMENT
// =======================

class ContractionTimer {
    constructor() {
        this.contractions = this.loadFromStorage();
        this.currentContraction = null;
        this.timerInterval = null;
        this.chartViewMode = 'withEnvelope'; // 'dataOnly', 'withEnvelope', 'zoomToConvergence'
        this.initializeUI();
        this.attachEventListeners();
        this.updateUI();
    }

    loadFromStorage() {
        const data = localStorage.getItem('contractions');
        return data ? JSON.parse(data) : [];
    }

    saveToStorage() {
        localStorage.setItem('contractions', JSON.stringify(this.contractions));
    }

    initializeUI() {
        this.mainButton = document.getElementById('mainButton');
        this.timerDisplay = document.getElementById('timerDisplay');
        this.lastDurationEl = document.getElementById('lastDuration');
        this.frequencyEl = document.getElementById('frequency');
        this.avg30minEl = document.getElementById('avg30min');
        this.avg1hourEl = document.getElementById('avg1hour');
        this.stdDevEl = document.getElementById('stdDev');
        this.predictedTimeEl = document.getElementById('predictedTime');
        this.confidenceEl = document.getElementById('confidence');
        this.contractionListEl = document.getElementById('contractionList');
        this.customMinutesInput = document.getElementById('customMinutes');
        this.customResultEl = document.getElementById('customResult');
        
        // View control buttons
        this.viewDataOnlyBtn = document.getElementById('viewDataOnlyBtn');
        this.viewWithEnvelopeBtn = document.getElementById('viewWithEnvelopeBtn');
        this.viewZoomOutBtn = document.getElementById('viewZoomOutBtn');
        
        // Instructions toggle
        this.instructionsToggle = document.getElementById('instructionsToggle');
        this.instructionsSection = document.getElementById('instructionsSection');
        
        // Import file input
        this.importFileInput = document.getElementById('importFileInput');
    }

    attachEventListeners() {
        this.mainButton.addEventListener('click', () => this.handleMainButtonClick());
        document.getElementById('importBtn').addEventListener('click', () => this.triggerImport());
        this.importFileInput.addEventListener('change', (e) => this.importFromCSV(e));
        document.getElementById('exportBtn').addEventListener('click', () => this.exportToCSV());
        document.getElementById('clearAllBtn').addEventListener('click', () => this.clearAll());
        document.getElementById('calcCustomBtn').addEventListener('click', () => this.calculateCustomAverage());
        
        // View control buttons
        this.viewDataOnlyBtn.addEventListener('click', () => this.setChartView('dataOnly'));
        this.viewWithEnvelopeBtn.addEventListener('click', () => this.setChartView('withEnvelope'));
        this.viewZoomOutBtn.addEventListener('click', () => this.setChartView('zoomToConvergence'));
        
        // Instructions toggle
        this.instructionsToggle.addEventListener('click', () => {
            this.instructionsSection.classList.toggle('collapsed');
        });
    }

    setChartView(mode) {
        this.chartViewMode = mode;
        
        // Update button states
        this.viewDataOnlyBtn.classList.remove('active');
        this.viewWithEnvelopeBtn.classList.remove('active');
        this.viewZoomOutBtn.classList.remove('active');
        
        if (mode === 'dataOnly') {
            this.viewDataOnlyBtn.classList.add('active');
        } else if (mode === 'withEnvelope') {
            this.viewWithEnvelopeBtn.classList.add('active');
        } else if (mode === 'zoomToConvergence') {
            this.viewZoomOutBtn.classList.add('active');
        }
        
        // Redraw chart with new view mode
        this.renderChart();
    }

    handleMainButtonClick() {
        if (!this.currentContraction) {
            // Start new contraction
            this.startContraction();
        } else {
            // End contraction
            this.endContraction();
        }
    }

    startContraction() {
        this.currentContraction = {
            startTime: Date.now(),
            endTime: null
        };
        this.mainButton.textContent = 'Stop Contraction';
        this.mainButton.classList.add('active');
        
        // Start timer display
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.currentContraction.startTime;
            this.timerDisplay.textContent = this.formatDuration(elapsed);
        }, 100);
    }

    endContraction() {
        this.currentContraction.endTime = Date.now();
        clearInterval(this.timerInterval);
        
        // Add to contractions array
        this.contractions.push(this.currentContraction);
        this.saveToStorage();
        
        // Reset UI
        this.mainButton.textContent = 'Start Contraction';
        this.mainButton.classList.remove('active');
        this.timerDisplay.textContent = '--:--';
        this.currentContraction = null;
        
        // Update all displays
        this.updateUI();
    }

    updateUI() {
        this.updateStats();
        this.updatePrediction();
        this.renderHistory();
        this.renderChart();
    }

    // =======================
    // STATISTICS CALCULATIONS
    // =======================

    calculateDuration(contraction) {
        return contraction.endTime - contraction.startTime;
    }

    calculateFrequency(index) {
        if (index === 0) return null;
        const current = this.contractions[index];
        const previous = this.contractions[index - 1];
        return current.startTime - previous.startTime;
    }

    getContractionsSince(minutes) {
        const cutoffTime = Date.now() - (minutes * 60 * 1000);
        return this.contractions.filter(c => c.startTime >= cutoffTime);
    }

    calculateAverageDuration(contractions) {
        if (contractions.length === 0) return null;
        const total = contractions.reduce((sum, c) => sum + this.calculateDuration(c), 0);
        return total / contractions.length;
    }

    calculateStandardDeviation(contractions) {
        if (contractions.length < 2) return null;
        
        const durations = contractions.map(c => this.calculateDuration(c));
        const mean = durations.reduce((sum, d) => sum + d, 0) / durations.length;
        const squaredDiffs = durations.map(d => Math.pow(d - mean, 2));
        const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / durations.length;
        
        return Math.sqrt(variance);
    }

    updateStats() {
        // Last Duration
        if (this.contractions.length > 0) {
            const lastContraction = this.contractions[this.contractions.length - 1];
            const duration = this.calculateDuration(lastContraction);
            this.lastDurationEl.textContent = this.formatDuration(duration);
        } else {
            this.lastDurationEl.textContent = '--';
        }

        // Frequency
        if (this.contractions.length > 1) {
            const frequency = this.calculateFrequency(this.contractions.length - 1);
            this.frequencyEl.textContent = this.formatDuration(frequency);
        } else {
            this.frequencyEl.textContent = '--';
        }

        // 30 min average
        const contractions30min = this.getContractionsSince(30);
        if (contractions30min.length > 0) {
            const avg = this.calculateAverageDuration(contractions30min);
            this.avg30minEl.textContent = this.formatDuration(avg);
        } else {
            this.avg30minEl.textContent = '--';
        }

        // 1 hour average
        const contractions1hour = this.getContractionsSince(60);
        if (contractions1hour.length > 0) {
            const avg = this.calculateAverageDuration(contractions1hour);
            this.avg1hourEl.textContent = this.formatDuration(avg);
        } else {
            this.avg1hourEl.textContent = '--';
        }
    }

    calculateCustomAverage() {
        const minutes = parseInt(this.customMinutesInput.value);
        if (isNaN(minutes) || minutes <= 0) {
            this.customResultEl.textContent = 'Invalid input';
            return;
        }

        const contractions = this.getContractionsSince(minutes);
        if (contractions.length > 0) {
            const avg = this.calculateAverageDuration(contractions);
            this.customResultEl.textContent = this.formatDuration(avg);
        } else {
            this.customResultEl.textContent = 'No data';
        }
    }

    // =======================
    // PREDICTION ENGINE
    // =======================

    updatePrediction() {
        if (this.contractions.length < 10) {
            this.stdDevEl.textContent = 'Need more data';
            this.predictedTimeEl.textContent = 'Recording...';
            this.confidenceEl.textContent = '--';
            return;
        }

        // Calculate standard deviation for current contractions
        const currentStdDev = this.calculateStandardDeviation(this.contractions);
        this.stdDevEl.textContent = this.formatDuration(currentStdDev);

        // Calculate SD over sliding windows to detect convergence
        const windowSize = 10;
        const sdOverTime = [];

        for (let i = windowSize; i <= this.contractions.length; i++) {
            const window = this.contractions.slice(i - windowSize, i);
            const sd = this.calculateStandardDeviation(window);
            const avgTime = window.reduce((sum, c) => sum + c.startTime, 0) / window.length;
            sdOverTime.push({ time: avgTime, sd: sd });
        }

        if (sdOverTime.length < 3) {
            this.predictedTimeEl.textContent = 'Need more data';
            this.confidenceEl.textContent = '--';
            return;
        }

        // Perform linear regression on SD over time
        const regression = this.linearRegression(
            sdOverTime.map(d => d.time),
            sdOverTime.map(d => d.sd)
        );

        // Check if SD is decreasing (negative slope)
        if (regression.slope >= 0) {
            this.predictedTimeEl.textContent = 'Not converging yet';
            this.confidenceEl.textContent = '--';
            return;
        }

        // Calculate when SD will reach zero: y = mx + b, solve for x when y = 0
        // x = -b / m
        const predictedTimestamp = -regression.intercept / regression.slope;
        const predictedDate = new Date(predictedTimestamp);

        // Check if prediction is reasonable (within next 24 hours)
        const hoursFromNow = (predictedTimestamp - Date.now()) / (1000 * 60 * 60);
        
        if (hoursFromNow < 0 || hoursFromNow > 24) {
            this.predictedTimeEl.textContent = 'Outside range';
            this.confidenceEl.textContent = '--';
        } else {
            this.predictedTimeEl.textContent = predictedDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Calculate confidence based on R-squared
            const confidence = Math.max(0, Math.min(100, regression.r2 * 100));
            this.confidenceEl.textContent = confidence.toFixed(1) + '%';
        }
    }

    linearRegression(x, y) {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Calculate R-squared
        const yMean = sumY / n;
        const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
        const ssResidual = y.reduce((sum, yi, i) => {
            const predicted = slope * x[i] + intercept;
            return sum + Math.pow(yi - predicted, 2);
        }, 0);
        const r2 = 1 - (ssResidual / ssTotal);

        return { slope, intercept, r2 };
    }

    // =======================
    // VISUALIZATION
    // =======================

    renderChart() {
        const canvas = document.getElementById('contractionChart');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = 400;

        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (this.contractions.length === 0) {
            ctx.fillStyle = '#666666';
            ctx.font = '20px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('No data yet', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Prepare data
        const durations = this.contractions.map(c => this.calculateDuration(c) / 1000); // in seconds
        const times = this.contractions.map(c => c.startTime);

        // Calculate convergence point early to determine time range
        let convergencePoint = null;
        if (this.contractions.length >= 10) {
            const windowSize = 10;
            const means = [];
            const sds = [];
            const windowTimes = [];

            for (let i = windowSize; i <= this.contractions.length; i++) {
                const window = this.contractions.slice(i - windowSize, i);
                const windowDurations = window.map(c => this.calculateDuration(c) / 1000);
                const mean = windowDurations.reduce((a, b) => a + b, 0) / windowDurations.length;
                const sd = this.calculateStandardDeviation(window) / 1000;
                const avgTime = window.reduce((sum, c) => sum + c.startTime, 0) / window.length;

                means.push(mean);
                sds.push(sd);
                windowTimes.push(avgTime);
            }

            if (sds.length >= 3) {
                const sdRegression = this.linearRegression(windowTimes, sds);
                const meanRegression = this.linearRegression(windowTimes, means);
                
                if (sdRegression.slope < 0) {
                    const predictedTime = -sdRegression.intercept / sdRegression.slope;
                    const predictedMean = meanRegression.slope * predictedTime + meanRegression.intercept;
                    
                    const hoursFromNow = (predictedTime - Date.now()) / (1000 * 60 * 60);
                    if (hoursFromNow > 0 && hoursFromNow <= 24) {
                        convergencePoint = { time: predictedTime, value: predictedMean };
                    }
                }
            }
        }

        // Find min/max for scaling based on view mode
        let minTime = Math.min(...times);
        let maxTime = Math.max(...times);
        let minDuration = Math.min(...durations);
        let maxDuration = Math.max(...durations);

        // Adjust time range based on view mode
        if (this.chartViewMode === 'zoomToConvergence' && convergencePoint) {
            maxTime = convergencePoint.time;
            // Add 10% padding to duration range for convergence point
            const durationPadding = (maxDuration - minDuration) * 0.1;
            minDuration = Math.min(minDuration, convergencePoint.value - durationPadding);
            maxDuration = Math.max(maxDuration, convergencePoint.value + durationPadding);
        }

        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        // Scale functions
        const scaleX = (time) => padding + ((time - minTime) / (maxTime - minTime)) * chartWidth;
        const scaleY = (duration) => canvas.height - padding - ((duration - minDuration) / (maxDuration - minDuration)) * chartHeight;

        // Draw axes
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();

        // Draw data points
        ctx.fillStyle = '#FFFFFF';
        times.forEach((time, i) => {
            const x = scaleX(time);
            const y = scaleY(durations[i]);
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Draw envelope lines if enough data and view mode allows it
        if (this.contractions.length >= 10 && this.chartViewMode !== 'dataOnly') {
            const windowSize = 10;
            const upperBound = [];
            const lowerBound = [];

            for (let i = windowSize; i <= this.contractions.length; i++) {
                const window = this.contractions.slice(i - windowSize, i);
                const windowDurations = window.map(c => this.calculateDuration(c) / 1000);
                const mean = windowDurations.reduce((a, b) => a + b, 0) / windowDurations.length;
                const sd = this.calculateStandardDeviation(window) / 1000;
                const avgTime = window.reduce((sum, c) => sum + c.startTime, 0) / window.length;

                upperBound.push({ time: avgTime, value: mean + sd });
                lowerBound.push({ time: avgTime, value: mean - sd });
            }

            // Draw upper bound
            ctx.strokeStyle = '#00FF88';
            ctx.lineWidth = 2;
            ctx.beginPath();
            upperBound.forEach((point, i) => {
                const x = scaleX(point.time);
                const y = scaleY(point.value);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            
            // Extend to convergence point if available
            if (convergencePoint) {
                const x = scaleX(convergencePoint.time);
                const y = scaleY(convergencePoint.value);
                ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Draw lower bound
            ctx.beginPath();
            lowerBound.forEach((point, i) => {
                const x = scaleX(point.time);
                const y = scaleY(point.value);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            
            // Extend to convergence point if available
            if (convergencePoint) {
                const x = scaleX(convergencePoint.time);
                const y = scaleY(convergencePoint.value);
                ctx.lineTo(x, y);
            }
            ctx.stroke();
            
            // Draw convergence point marker if available
            if (convergencePoint) {
                // Draw a yellow star marker
                ctx.fillStyle = '#FFFF00';
                ctx.strokeStyle = '#FFFF00';
                ctx.lineWidth = 3;
                const x = scaleX(convergencePoint.time);
                const y = scaleY(convergencePoint.value);
                
                // Draw star shape
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                    const xPos = x + Math.cos(angle) * (i % 2 === 0 ? 8 : 3);
                    const yPos = y + Math.sin(angle) * (i % 2 === 0 ? 8 : 3);
                    if (i === 0) ctx.moveTo(xPos, yPos);
                    else ctx.lineTo(xPos, yPos);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Draw a label
                ctx.fillStyle = '#FFFF00';
                ctx.font = 'bold 14px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('★ Singularity', x, y - 15);
                
                // Draw time label
                const date = new Date(convergencePoint.time);
                const timeStr = date.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                ctx.font = '12px sans-serif';
                ctx.fillText(timeStr, x, y + 25);
            }
        }

        // Draw axis labels and values
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px sans-serif';
        
        // Y-axis values (duration)
        ctx.textAlign = 'right';
        const yTicks = 5;
        for (let i = 0; i <= yTicks; i++) {
            const duration = minDuration + (maxDuration - minDuration) * i / yTicks;
            const y = scaleY(duration);
            ctx.fillText(Math.round(duration) + 's', padding - 10, y + 4);
            
            // Draw tick marks
            ctx.strokeStyle = '#666666';
            ctx.beginPath();
            ctx.moveTo(padding - 5, y);
            ctx.lineTo(padding, y);
            ctx.stroke();
        }
        
        // X-axis values (time)
        ctx.textAlign = 'center';
        const xTicks = 4;
        for (let i = 0; i <= xTicks; i++) {
            const time = minTime + (maxTime - minTime) * i / xTicks;
            const x = scaleX(time);
            const date = new Date(time);
            const timeStr = date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            ctx.fillText(timeStr, x, canvas.height - padding + 20);
            
            // Draw tick marks
            ctx.strokeStyle = '#666666';
            ctx.beginPath();
            ctx.moveTo(x, canvas.height - padding);
            ctx.lineTo(x, canvas.height - padding + 5);
            ctx.stroke();
        }
        
        // Axis labels
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText('Time', canvas.width / 2, canvas.height - 5);
        
        ctx.save();
        ctx.translate(10, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Duration (seconds)', 0, 0);
        ctx.restore();
    }

    // =======================
    // HISTORY MANAGEMENT
    // =======================

    renderHistory() {
        if (this.contractions.length === 0) {
            this.contractionListEl.innerHTML = '<div class="empty-state">No contractions recorded yet. Press the big button to start.</div>';
            return;
        }

        this.contractionListEl.innerHTML = '';
        
        // Render in reverse order (newest first)
        [...this.contractions].reverse().forEach((contraction, reverseIndex) => {
            const actualIndex = this.contractions.length - 1 - reverseIndex;
            const item = this.createContractionItem(contraction, actualIndex);
            this.contractionListEl.appendChild(item);
        });
    }

    createContractionItem(contraction, index) {
        const div = document.createElement('div');
        div.className = 'contraction-item';

        const duration = this.calculateDuration(contraction);
        const frequency = index > 0 ? this.calculateFrequency(index) : null;
        const time = new Date(contraction.startTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        div.innerHTML = `
            <div class="contraction-time">${time}</div>
            <div class="contraction-stats">
                <span>Duration: <strong>${this.formatDuration(duration)}</strong></span>
                ${frequency ? `<span>Frequency: <strong>${this.formatDuration(frequency)}</strong></span>` : ''}
            </div>
            <div class="contraction-actions">
                <button class="action-btn delete" data-index="${index}">Delete</button>
            </div>
        `;

        // Attach delete handler
        div.querySelector('.action-btn.delete').addEventListener('click', (e) => {
            const idx = parseInt(e.target.getAttribute('data-index'));
            this.deleteContraction(idx);
        });

        return div;
    }

    deleteContraction(index) {
        if (confirm('Are you sure you want to delete this contraction?')) {
            this.contractions.splice(index, 1);
            this.saveToStorage();
            this.updateUI();
        }
    }

    clearAll() {
        if (confirm('Are you sure you want to delete ALL contractions? This cannot be undone.')) {
            this.contractions = [];
            this.saveToStorage();
            this.updateUI();
        }
    }

    // =======================
    // IMPORT/EXPORT FUNCTIONALITY
    // =======================

    triggerImport() {
        this.importFileInput.click();
    }

    importFromCSV(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csvContent = e.target.result;
                const lines = csvContent.split('\n').filter(line => line.trim() !== '');
                
                // Check if file has header
                if (lines.length < 2) {
                    alert('CSV file is empty or invalid!');
                    return;
                }

                // Parse header
                const header = lines[0].toLowerCase();
                if (!header.includes('start time') || !header.includes('end time')) {
                    alert('Invalid CSV format! File must contain "Start Time" and "End Time" columns.');
                    return;
                }

                // Parse data rows
                const importedContractions = [];
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;

                    // Parse CSV line (handling quoted values)
                    const values = this.parseCSVLine(line);
                    
                    if (values.length < 3) continue;

                    // Extract start time and end time (columns 1 and 2, index 0 is the row number)
                    const startTimeStr = values[1];
                    const endTimeStr = values[2];

                    // Parse ISO date strings
                    const startTime = new Date(startTimeStr).getTime();
                    const endTime = new Date(endTimeStr).getTime();

                    // Validate timestamps
                    if (isNaN(startTime) || isNaN(endTime)) {
                        console.warn(`Skipping invalid row ${i}: Invalid date format`);
                        continue;
                    }

                    if (endTime <= startTime) {
                        console.warn(`Skipping invalid row ${i}: End time must be after start time`);
                        continue;
                    }

                    importedContractions.push({
                        startTime: startTime,
                        endTime: endTime
                    });
                }

                if (importedContractions.length === 0) {
                    alert('No valid contractions found in the CSV file!');
                    return;
                }

                // Ask user if they want to append or replace
                const action = confirm(
                    `Found ${importedContractions.length} contractions in the file.\n\n` +
                    `Click OK to APPEND to existing data (${this.contractions.length} contractions).\n` +
                    `Click Cancel to REPLACE all existing data.`
                );

                if (action) {
                    // Append
                    this.contractions = [...this.contractions, ...importedContractions];
                } else {
                    // Replace
                    this.contractions = importedContractions;
                }

                // Sort by start time to ensure chronological order
                this.contractions.sort((a, b) => a.startTime - b.startTime);

                // Save and update UI
                this.saveToStorage();
                this.updateUI();

                alert(`Successfully imported ${importedContractions.length} contractions!`);

                // Reset file input
                event.target.value = '';
            } catch (error) {
                console.error('Import error:', error);
                alert('Error importing CSV file: ' + error.message);
            }
        };

        reader.onerror = () => {
            alert('Error reading file!');
        };

        reader.readAsText(file);
    }

    parseCSVLine(line) {
        const values = [];
        let currentValue = '';
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
                values.push(currentValue.trim());
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        
        // Add the last value
        values.push(currentValue.trim());
        
        return values;
    }

    exportToCSV() {
        if (this.contractions.length === 0) {
            alert('No data to export!');
            return;
        }

        // Create CSV content
        let csv = 'Index,Start Time,End Time,Duration (seconds),Duration (formatted),Frequency (seconds),Frequency (formatted)\n';

        this.contractions.forEach((contraction, index) => {
            const startTime = new Date(contraction.startTime).toISOString();
            const endTime = new Date(contraction.endTime).toISOString();
            const duration = this.calculateDuration(contraction);
            const durationSeconds = (duration / 1000).toFixed(2);
            const durationFormatted = this.formatDuration(duration);
            
            let frequencySeconds = '';
            let frequencyFormatted = '';
            if (index > 0) {
                const frequency = this.calculateFrequency(index);
                frequencySeconds = (frequency / 1000).toFixed(2);
                frequencyFormatted = this.formatDuration(frequency);
            }

            csv += `${index + 1},"${startTime}","${endTime}",${durationSeconds},"${durationFormatted}",${frequencySeconds},"${frequencyFormatted}"\n`;
        });

        // Create download link
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contractions_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    // =======================
    // UTILITY FUNCTIONS
    // =======================

    formatDuration(ms) {
        if (ms === null || ms === undefined || isNaN(ms)) return '--';
        
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        if (minutes > 0) {
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        } else {
            return `0:${remainingSeconds.toString().padStart(2, '0')}`;
        }
    }
}

// =======================
// INITIALIZATION
// =======================

let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ContractionTimer();
});

