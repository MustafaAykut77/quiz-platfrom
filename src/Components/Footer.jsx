import { Brain, Trophy, Users, BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Play } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Arka plan deseni */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full"></div>
        <div className="absolute top-12 right-8 w-4 h-4 bg-yellow-400 rounded-full"></div>
        <div className="absolute bottom-16 left-12 w-6 h-6 bg-pink-400 rounded-full"></div>
        <div className="absolute bottom-8 right-16 w-5 h-5 border-2 border-green-400 rounded"></div>
      </div>

      {/* Ana Footer İçeriği */}
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Qwiz Bilgileri */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-yellow-400" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Qwiz
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Eğlenceli ve eğitici quizlerle bilginizi test edin, arkadaşlarınızla yarışın ve yeni şeyler öğrenin!
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-all duration-300 hover:scale-110" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-all duration-300 hover:scale-110" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-pink-400 cursor-pointer transition-all duration-300 hover:scale-110" />
              <Youtube className="w-5 h-5 text-gray-400 hover:text-red-400 cursor-pointer transition-all duration-300 hover:scale-110" />
            </div>
          </div>

          {/* Quiz Kategorileri */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-green-400" />
              Quiz Kategorileri
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm flex items-center group">
                <Play className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                Genel Kültür
              </a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm flex items-center group">
                <Play className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                Tarih
              </a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm flex items-center group">
                <Play className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                Bilim & Teknoloji
              </a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm flex items-center group">
                <Play className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                Spor
              </a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm flex items-center group">
                <Play className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                Sanat & Edebiyat
              </a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm flex items-center group">
                <Play className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                Eğlence
              </a></li>
            </ul>
          </div>

          {/* Özellikler */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
              Özellikler
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Günlük Yarışmalar</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Liderlik Tablosu</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Arkadaş Mücadelesi</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Başarı Rozetleri</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Özel Quiz Oluştur</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">İstatistikler</a></li>
            </ul>
          </div>

          {/* İletişim & Destek */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-400" />
              Destek
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">İştanbul, Türkiye</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">hello@qwiz.app</span>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <a href="#" className="block text-gray-300 hover:text-yellow-400 transition-colors text-sm">Yardım Merkezi</a>
              <a href="#" className="block text-gray-300 hover:text-yellow-400 transition-colors text-sm">SSS</a>
              <a href="#" className="block text-gray-300 hover:text-yellow-400 transition-colors text-sm">Geri Bildirim</a>
            </div>
          </div>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="bg-black bg-opacity-20 border-t border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-yellow-400">50K+</div>
              <div className="text-gray-300 text-sm">Aktif Kullanıcı</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-green-400">1M+</div>
              <div className="text-gray-300 text-sm">Çözülen Quiz</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-blue-400">25K+</div>
              <div className="text-gray-300 text-sm">Quiz Sorusu</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-pink-400">100+</div>
              <div className="text-gray-300 text-sm">Kategori</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Footer */}
      <div className="bg-black bg-opacity-30 border-t border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm flex items-center">
              <Brain className="w-4 h-4 mr-2 text-yellow-400" />
              © 2024 Qwiz. Tüm hakları saklıdır.
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Gizlilik Politikası</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Kullanım Koşulları</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Çerez Politikası</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Uygulama İndir</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}