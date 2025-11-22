const API_URL = 'https://mskjdn.pythonanywhere.com/predict';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('healthForm');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        calculateRisk();
    });

    checkAPIConnection();
});

async function checkAPIConnection() {
    try {
        const response = await fetch('https://mskjdn.pythonanywhere.com/health', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        console.warn('API not available');
    }
}

async function calculateRisk() {
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const chest_pain = document.getElementById('chest_pain').value;
    const shortness_of_breath = document.getElementById('shortness_of_breath').value;
    const fatigue = document.getElementById('fatigue').value;
    const palpitations = document.getElementById('palpitations').value;
    const dizziness = document.getElementById('dizziness').value;
    const swelling = document.getElementById('swelling').value;
    const radiating_pain = document.getElementById('radiating_pain').value;
    const cold_sweat = document.getElementById('cold_sweat').value;
    const blood_pressure_history = document.getElementById('blood_pressure_history').value;
    const cholesterol_level = document.getElementById('cholesterol_level').value;
    const diabetes_history = document.getElementById('diabetes_history').value;
    const smoking_history = document.getElementById('smoking_history').value;
    const obesity = document.getElementById('obesity').value;
    const lifestyle = document.getElementById('lifestyle').value;
    const family_history = document.getElementById('family_history').value;
    const chronic_stress = document.getElementById('chronic_stress').value;

    const formData = {
        age: age,
        gender: gender,
        chest_pain: chest_pain,
        shortness_of_breath: shortness_of_breath,
        fatigue: fatigue,
        palpitations: palpitations,
        dizziness: dizziness,
        swelling: swelling,
        radiating_pain: radiating_pain,
        cold_sweat: cold_sweat,
        blood_pressure_history: blood_pressure_history,
        cholesterol_level: cholesterol_level,
        diabetes_history: diabetes_history,
        smoking_history: smoking_history,
        obesity: obesity,
        lifestyle: lifestyle,
        family_history: family_history,
        chronic_stress: chronic_stress
    };

    const submitButton = document.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Memproses...';
    submitButton.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(`API request failed: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            displayResultsFromAPI(result);
        } else {
            throw new Error(result.message || 'Prediction failed');
        }

    } catch (error) {
        alert('Gagal terhubung ke server!');

    } finally {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    }
}

function displayResultsFromAPI(apiResult) {
    const resultSection = document.getElementById('resultSection');
    const riskDisplay = document.getElementById('riskDisplay');
    const riskIcon = document.getElementById('riskIcon');
    const riskLevel = document.getElementById('riskLevel');
    const riskPercentage = document.getElementById('riskPercentage');
    const statusText = document.getElementById('statusText');
    const categoryText = document.getElementById('categoryText');
    const priorityText = document.getElementById('priorityText');
    const recommendations = document.getElementById('recommendations');

    const riskScore = apiResult.risk_score;
    const level = apiResult.risk_level;
    let riskClass, iconClass, recommendationList;

    if (level === "Risiko Rendah") {
        riskClass = 'risk-low';
        iconClass = 'fa-heart text-green-600';
        recommendationList = [
            'Pertahankan gaya hidup sehat Anda',
            'Lakukan olahraga teratur minimal 30 menit per hari',
            'Konsumsi makanan bergizi seimbang',
            'Check-up kesehatan rutin setahun sekali',
            'Hindari stres berlebihan'
        ];
    } else if (level === "Risiko Sedang") {
        riskClass = 'risk-medium';
        iconClass = 'fa-heart text-yellow-600';
        recommendationList = [
            'Konsultasi dengan dokter untuk pemeriksaan lebih lanjut',
            'Tingkatkan aktivitas fisik menjadi 5x seminggu',
            'Kurangi konsumsi makanan tinggi lemak dan garam',
            'Monitor tekanan darah dan kolesterol secara berkala',
            'Pertimbangkan untuk berhenti merokok jika merokok',
            'Kelola stres dengan baik'
        ];
    } else { // Risiko Tinggi
        riskClass = 'risk-high';
        iconClass = 'fa-heart-crack text-orange-600';
        recommendationList = [
            '⚠️ Segera konsultasi dengan dokter spesialis jantung',
            'Lakukan pemeriksaan kardiovaskular lengkap',
            'Ubah pola makan dengan diet rendah garam dan lemak jenuh',
            'Hindari aktivitas berat tanpa supervisi medis',
            'Berhenti merokok segera',
            'Monitor kesehatan harian secara ketat',
            'Pertimbangkan terapi medis sesuai anjuran dokter'
        ];
    }

    riskDisplay.className = `text-center p-8 rounded-lg ${riskClass}`;
    riskIcon.className = `fas ${iconClass} text-6xl`;
    riskLevel.textContent = apiResult.risk_level;
    riskPercentage.style.display = 'none';
    statusText.textContent = apiResult.status;
    categoryText.textContent = apiResult.category;
    priorityText.textContent = apiResult.priority;

    recommendations.innerHTML = '';
    recommendationList.forEach(rec => {
        const li = document.createElement('li');
        li.className = 'flex items-start';
        li.innerHTML = `
            <i class="fas fa-check-circle text-red-600 mr-2 mt-1"></i>
            <span>${rec}</span>
        `;
        recommendations.appendChild(li);
    });

    resultSection.classList.remove('hidden');
    resultSection.classList.add('fade-in');
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('DOMContentLoaded', function () {
    const ageInput = document.getElementById('age');
    if (ageInput) {
        ageInput.addEventListener('input', function () {
            if (this.value > 120) this.value = 120;
            if (this.value < 0) this.value = 0;
        });
    }
});
