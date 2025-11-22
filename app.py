from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

MODEL_PATH = 'rf_model.pkl'

try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route('/')
def home():
    return jsonify({
        "message": "Heart Disease Prediction API",
        "status": "running",
        "endpoints": {
            "/predict": "POST - Predict heart disease risk"
        }
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if model is None:
            return jsonify({
                "error": "Model not loaded",
                "message": "Please ensure rf_model.pkl is in the correct location"
            }), 500

        data = request.get_json()
        
        # Extract features from request
        age = int(data.get('age', 0))
        gender = 1 if data.get('gender') == 'male' else 0
        chest_pain = 1 if data.get('chest_pain') == 'Yes' else 0
        shortness_of_breath = 1 if data.get('shortness_of_breath') == 'Yes' else 0
        fatigue = 1 if data.get('fatigue') == 'Yes' else 0
        palpitations = 1 if data.get('palpitations') == 'Yes' else 0
        dizziness = 1 if data.get('dizziness') == 'Yes' else 0
        swelling = 1 if data.get('swelling') == 'Yes' else 0
        radiating_pain = 1 if data.get('radiating_pain') == 'Yes' else 0
        cold_sweat = 1 if data.get('cold_sweat') == 'Yes' else 0
        blood_pressure_history = 1 if data.get('blood_pressure_history') == 'Yes' else 0
        cholesterol_level = 1 if data.get('cholesterol_level') == 'Yes' else 0
        diabetes_history = 1 if data.get('diabetes_history') == 'Yes' else 0
        smoking_history = 1 if data.get('smoking_history') == 'Yes' else 0
        obesity = 1 if data.get('obesity') == 'Yes' else 0
        lifestyle = 1 if data.get('lifestyle') == 'Yes' else 0
        family_history = 1 if data.get('family_history') == 'Yes' else 0
        chronic_stress = 1 if data.get('chronic_stress') == 'Yes' else 0
        
        # Create feature array with column names
        feature_names = [
            'Age',
            'Gender',
            'Chest_Pain',
            'Shortness_of_Breath',
            'Fatigue',
            'Palpitations',
            'Dizziness',
            'Swelling',
            'Pain_Arms_Jaw_Back',
            'Cold_Sweats_Nausea',
            'High_BP',
            'High_Cholesterol',
            'Diabetes',
            'Smoking',
            'Obesity',
            'Sedentary_Lifestyle',
            'Family_History',
            'Chronic_Stress',
        ]
        
        feature_values = [
            age, gender, chest_pain, shortness_of_breath, fatigue, palpitations,
            dizziness, swelling, radiating_pain, cold_sweat, blood_pressure_history,
            cholesterol_level, diabetes_history, smoking_history, obesity, lifestyle,
            family_history, chronic_stress
        ]
        
        features = pd.DataFrame([feature_values], columns=feature_names)
        
        prediction = model.predict(features)[0]
        
        if hasattr(model, 'predict_proba'):
            probability = model.predict_proba(features)[0]
            risk_probability = float(probability[1] * 100)
        else:
            risk_probability = 100.0 if prediction == 1 else 0.0

        batas = 20 
        if risk_probability >= batas:
            risk_level = "Risiko Tinggi"
            category = "Berbahaya"
            status = "Memerlukan Tindakan"
            priority = "Segera"
        elif risk_probability >= 9:
            risk_level = "Risiko Sedang"
            category = "Waspada"
            status = "Perlu Perhatian"
            priority = "Monitoring"
        else:
            risk_level = "Risiko Rendah"
            category = "Baik"
            status = "Sehat"
            priority = "Rutin"
        
        return jsonify({
            "success": True,
            "prediction": int(prediction),
            "risk_score": round(risk_probability, 2),
            "risk_level": risk_level,
            "category": category,
            "status": status,
            "priority": priority,
            "message": "Prediction successful"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "Error during prediction"
        }), 400

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
