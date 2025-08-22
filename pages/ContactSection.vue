<template>
  <div id="contact" class="cta-container">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="bg-element"></div>
      <div class="bg-element"></div>
      <div class="bg-element"></div>
    </div>

    <div class="cta-content">
      <!-- Left Content -->
      <div class="cta-text">
        <h2 class="cta-title">
          Kasb tanlashdagi birinchi<br>
          yordamni beramiz!
        </h2>
        
        <!-- Service-specific message when service is selected -->
        <p v-if="formData.service" class="cta-description service-message">
          <strong>{{ formData.service }}</strong> haqida ma'lumot beramiz! Bizga ism va raqamingizni qoldiring, biz sizga o'zimiz aloqa qilamiz.
        </p>
        
        <!-- Default message when no service selected -->
        <p v-else class="cta-description">
          Ma'lumotlaringizni qoldiring va sizga tez<br>
          fursatda aloqaga chiqamiz
        </p>
      </div>

      <!-- Right Form -->
      <div class="cta-form-container">
        <form @submit.prevent="submitForm" class="cta-form">
          <div class="form-group">
            <label class="form-label">Ismingiz</label>
            <input 
              type="text" 
              v-model="formData.name"
              placeholder="Ismingizni yozing"
              class="form-input"
              required
            >
          </div>

          <div class="form-group">
            <label class="form-label">Telefon</label>
            <input 
              type="tel" 
              v-model="formData.phone"
              placeholder="+998 88 578 11 99"
              class="form-input"
              @input="formatPhone"
              required
            >
          </div>

          <!-- Kurs yoki xizmat tanlangan bo'lsa, ko'rsatamiz -->
          <div v-if="formData.course || formData.service" class="form-group">
            <label class="form-label">Tanlangan yo'nalish</label>
            <input 
              type="text" 
              :value="formData.course || formData.service"
              class="form-input"
              readonly
            >
          </div>

          <div class="checkbox-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="formData.consent"
                class="checkbox-input"
                required
              >
              <span class="checkbox-custom"></span>
              <span class="checkbox-text">
                Shaxsiy ma'lumotlarni qayta ishlashga roziman
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            class="submit-btn"
            :class="{ 'loading': isLoading }"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">So'rov yuborish</span>
            <span v-else class="loading-text">
              <i class="fas fa-spinner fa-spin"></i>
              Yuborilmoqda...
            </span>
          </button>

          <!-- Success Message -->
          <transition name="success">
            <div v-if="showSuccess" class="success-message">
              <div class="success-icon">
                <i class="fas fa-check"></i>
              </div>
              <div class="success-content">
                <h4>Muvaffaqiyatli yuborildi!</h4>
                <p>Tez orada siz bilan bog'lanamiz</p>
              </div>
            </div>
          </transition>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppCTA',
  props: {
    course: String,   // course.vue dan keladigan
    service: String   // service.vue dan keladigan
  },
  data() {
    return {
      isLoading: false,
      showSuccess: false,
      formData: {
        name: '',
        phone: '+998 ',
        consent: false,
        course: this.course || '',
        service: this.service || this.$route.query.service || ''
      }
    }
  },
  mounted() {
    // Query parametrdan service nomini olish
    if (this.$route.query.service) {
      this.formData.service = this.$route.query.service;
    }
    
    // Course nomini ID ga aylantirish uchun mapping
    this.courseMapping = {
      'Frontend Development': 1,
      'Backend Development': 2,
      'Mobile Development': 3,
      'UI/UX Design': 4,
      'Digital Marketing': 5,
      'Data Science': 6,
      // Boshqa kurslar...
    };
    
    // Service nomini ID ga aylantirish uchun mapping
    this.serviceMapping = {
      'Veb-sayt yaratish': 1,
      'Mobil ilova ishlab chiqish': 2,
      'IT konsalting': 3,
      'Server va tarmoq xizmatlari': 4,
      'Kiberxavfsizlik': 5,
      'Texnik qo\'llab-quvvatlash': 6,
      'Ma\'lumotlar bazasi ishlari': 7,
      'UI/UX dizayn': 8,
      'ERP va CRM tizimlarini joriy etish': 9,
      'Bulutli xizmatlar': 10,
      'Telegram bot': 11,
    };
  },
  watch: {
    // Format phone number
    'formData.phone'(newVal) {
      if (!newVal.startsWith('+998 ')) {
        this.formData.phone = '+998 ';
      }
    },
    course(newVal) {
      this.formData.course = newVal;
    },
    service(newVal) {
      this.formData.service = newVal;
    }
  },
  methods: {
    formatPhone(event) {
      let value = event.target.value.replace(/\D/g, '');
      if (!value.startsWith('998')) {
        value = '998' + value;
      }
      if (value.length > 12) {
        value = value.substring(0, 12);
      }
      
      let formatted = '+' + value;
      if (value.length > 3) {
        formatted = '+' + value.substring(0, 3) + ' ' + value.substring(3);
      }
      if (value.length > 5) {
        formatted = '+' + value.substring(0, 3) + ' ' + value.substring(3, 5) + ' ' + value.substring(5);
      }
      if (value.length > 8) {
        formatted = '+' + value.substring(0, 3) + ' ' + value.substring(3, 5) + ' ' + value.substring(5, 8) + ' ' + value.substring(8);
      }
      
      this.formData.phone = formatted;
    },

    async submitForm() {
      if (!this.formData.name || !this.formData.phone || !this.formData.consent) {
        return;
      }

      this.isLoading = true;

      try {
        // Tanlangan kurs yoki xizmat nomini course fieldiga qo'yish
        const selectedCourse = this.formData.course || this.formData.service || null;

        const leadData = {
          fullname: this.formData.name.trim(),
          phone_number: this.formData.phone,
          course: selectedCourse, // Course fieldiga nom qo'yish
          is_online: true,
          is_offline: false,
          is_agree: this.formData.consent
        };

        console.log('Sending data:', leadData);
        
        const response = await fetch('https://devops-itc.alwaysdata.net/api/leads/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(leadData)
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('API Error Response:', errorData);
          throw new Error(`HTTP error! status: ${response.status}, details: ${errorData}`);
        }
        
        const responseData = await response.json();
        console.log('Lead created successfully:', responseData);
        
        this.$emit('form-submitted', this.formData);
        this.showSuccessMessage();
        this.resetForm();
        
      } catch (error) {
        console.error('Form submission error:', error);
        this.showError();
      } finally {
        this.isLoading = false;
      }
    },
    
    resetForm() {
      this.formData = {
        name: '',
        phone: '+998 ',
        consent: false,
        course: this.course || '',
        service: this.service || this.$route.query.service || ''
      };
    },
    
    showSuccessMessage() {
      // Success xabarini ko'rsatish
      this.showSuccess = true;
      
      // 5 soniya keyin success xabarini yashirish
      setTimeout(() => {
        this.showSuccess = false;
      }, 5000);
    },
    
    showError() {
      alert('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
    }
  }
}
</script>

<style scoped>
/* .service-message {
  color: #2563eb;
  font-weight: 500;
}

.service-message strong {
  color: #1d4ed8;
  font-weight: 600;
} */

/* Success Message Styles */
.success-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  margin-top: 16px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  font-size: 18px;
  flex-shrink: 0;
}

.success-content h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
}

.success-content p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

/* Success Transition */
.success-enter-active {
  transition: all 0.3s ease-out;
}

.success-leave-active {
  transition: all 0.3s ease-in;
}

.success-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.success-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.cta-container {
  position: relative;
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  padding: 4rem 2rem;
  margin: 0 0 0 0;
  overflow: hidden;
}

/* Animated Background */
.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.bg-element {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float-minimal 8s ease-in-out infinite;
}

.bg-element:nth-child(1) {
  width: 120px;
  height: 120px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.bg-element:nth-child(2) {
  width: 80px;
  height: 80px;
  top: 60%;
  right: 15%;
  animation-delay: 3s;
}

.bg-element:nth-child(3) {
  width: 60px;
  height: 60px;
  top: 80%;
  left: 70%;
  animation-delay: 6s;
}

@keyframes float-minimal {
  0%, 100% { 
    transform: translateY(0px) translateX(0px);
    opacity: 0.7;
  }
  50% { 
    transform: translateY(-10px) translateX(10px);
    opacity: 1;
  }
}

/* Main Content */
.cta-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 2;
}

/* Left Text */
.cta-text {
  color: white;
}

.cta-title {
  font-size: 2.8rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.cta-description {
  font-size: 1.5rem;
  line-height: 1.6;
  opacity: 0.9;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* Form Container */
.cta-form-container {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  padding: 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideInRight 0.8s ease-out;
}

/* Form Styles */
.cta-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input {
  width: 100%;
  padding: 1rem 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  color: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.form-input:focus {
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.15);
}

/* Checkbox */
.checkbox-group {
  margin: 0.5rem 0;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
  line-height: 1.4;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  background: transparent;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 2px;
  position: relative;
}

.checkbox-input:checked + .checkbox-custom {
  background: white;
  border-color: white;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 2px;
  color: #00d4ff;
  font-weight: bold;
  font-size: 12px;
}

.checkbox-text {
  flex: 1;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 1.2rem 2rem;
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  border: none;
  border-radius: 1.5rem;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.submit-btn:hover::before {
  left: 100%;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.loading-text i {
  font-size: 0.9rem;
}

/* Animations */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .cta-content {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }
  
  .cta-form-container {
    max-width: 500px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .cta-container {
    padding: 3rem 1rem;
    margin: 2rem 0;
  }
  
  .cta-title {
    font-size: 2.2rem;
  }
  
  .cta-description {
    font-size: 1rem;
  }
  
  .cta-form-container {
    padding: 2rem;
  }
  
  .form-input {
    padding: 0.9rem 1rem;
  }
  
  .submit-btn {
    padding: 1rem 1.5rem;
    font-size: 0.9rem;
  }
  
  .bg-element {
    display: none; /* Hide floating elements on mobile */
  }
}

@media (max-width: 480px) {
  .cta-title {
    font-size: 1.8rem;
  }
  
  .cta-content {
    gap: 2rem;
  }
  
  .cta-form-container {
    padding: 1.5rem;
  }
}
</style>