const multer = require('multer');
const fs = require('fs'); // untuk manage file pd projek, cek dah ada atau belum

module.exports = {
    uploader: (directory, fileNamePrefix) => { //prefix untuk bantu tambah kode dasar di depan untuk file2 yg disimpan, otomatis gambar yg disimpan akan hasilin nama baru

        // mendefine lokasi penyimpanan utama scr default
        let defaultDir = './public'

        // Konfigurasi multer, diskStorage menentukan file disimpan di direktori mana
        const storageUploader = multer.diskStorage({
            destination: (req, file, cb) => {
                // Menentukan lokasi penyimpanan file
                const pathDir = directory ? defaultDir + directory : defaultDir;

                // Melakukan pemeriksaan pathDir
                if (fs.existsSync(pathDir)) {
                    // Jika directory ada, maka akan langsung digunakan untuk menyimpan file
                    console.log(`Directory ${pathDir} exist ✅`);
                    cb(null, pathDir);
                } else {
                    fs.mkdir(pathDir, { recursive: true }, (err) => cb(err, pathDir)); //recursive membuat direktori dlm direktori
                    console.log(`Success created ${pathDir} ✅`);
                }
            },
            filename: (req, file, cb) => {
                // Membaca tipe data file
                let ext = file.originalname.split('.');

                // Membuat filename baru
                let filename = fileNamePrefix + Date.now() + '.' + ext[ext.length - 1]; //ext[ext.length-1] krn ext dlm bentuk array hasil split
                //Date.now() menghasilkan datetime utc
                cb(null, filename);
            }
        });

        // Konfigurasi file apa saja yg boleh masuk
        const fileFilter = (req, file, cb) => {
            const extFilter = /\.(jpg|png|webp|svg|jpeg)/;
            if (!file.originalname.toLowerCase().match(extFilter)) {//klo match dgn regex akan return true makannya dikasih negacy
                return cb(new Error(`Your file ext are denied ❌`, false))
            }
            cb(null, true);
        }
        return multer({
            storage: storageUploader, //properti di dokumentasi mintanya storage
            fileFilter
        })
    }
}