echo "extart files start"
mkdir -p build
cp -r apps build
cp -r scripts build
cp -r styles build
cp -r images build
cp -r dist build
echo "extart files end"


echo "compress to zip start"
cd build
zip -rq ../WebApp.zip ./*
cd ..
echo "compress to zip end"

echo "remove build tmp file start"
rm -rf ${deploy_root}/build
echo "remove build tmp file end"


