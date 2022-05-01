<template>
  <div>
    <div
      class="header px-4 py-2 bg-white shadow d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start"
    >
      <h1 class="mb-0 me-lg-4 d-flex flex-column">
        <span class="text-lg-start text-center">
          <img src="@/assets/images/ic-test.png" class="me-2" width="25" />
          <span class="fs-4 fw-bold text-primary">找快篩</span>
        </span>
        <a
          href="#"
          class="f-14 d-flex align-items-center"
          @click="showModal = true"
        >
          <span class="material-symbols-outlined f-14 me-1"> info </span>
          <span>查看實名制領取快篩試劑說明</span>
        </a>
      </h1>
      <div class="me-lg-3 select">
        <select
          id="cityName"
          class="form-control"
          v-model="select.city"
          @change="updateCity"
        >
          <option :value="c.CityName" v-for="c in cityName" :key="c.CityName">
            {{ c.CityName }}
          </option>
        </select>
      </div>
      <div class="select">
        <select
          id="area"
          class="form-control"
          v-model="select.area"
          @change="updateSelect"
        >
          <option value="">請選擇地區</option>
          <option
            :value="a.AreaName"
            v-for="a in cityName.find((city) => city.CityName === select.city)
              .AreaList"
            :key="a.AreaName"
          >
            {{ a.AreaName }}
          </option>
        </select>
      </div>
    </div>
    <div class="main row gx-0">
      <!-- 列表 -->
      <div class="col-4 h-100 overflow-y-scroll d-lg-block d-none">
        <div v-if="selectedDatas.length > 0">
          <div class="card m-3" v-for="item in selectedDatas" :key="item">
            <div class="card-body">
              <h5
                class="card-title d-flex justify-content-between align-items-center mb-3"
              >
                <span>{{ item["醫事機構名稱"] }}</span>
                <div
                  v-if="item['快篩試劑截至目前結餘存貨數量'] >= 40"
                  class="bg-primary text-white rounded p-2 text-center fs-6 d-flex align-items-center"
                >
                  <small>快篩試劑剩餘：</small>
                  <span class="fs-5">{{
                    item["快篩試劑截至目前結餘存貨數量"]
                  }}</span>
                </div>
                <div
                  v-else-if="item['快篩試劑截至目前結餘存貨數量'] <= 15"
                  class="bg-danger text-white rounded p-2 text-center fs-6 d-flex align-items-center"
                >
                  <small>快篩試劑剩餘：</small>
                  <span class="fs-5">{{
                    item["快篩試劑截至目前結餘存貨數量"]
                  }}</span>
                </div>
                <div
                  v-else
                  class="bg-warning text-white rounded p-2 text-center fs-6 d-flex align-items-center"
                >
                  <small>快篩試劑剩餘：</small>
                  <span class="fs-5">{{
                    item["快篩試劑截至目前結餘存貨數量"]
                  }}</span>
                </div>
              </h5>
              <div class="card-text small">
                <p class="mb-2 d-flex align-items-center">
                  <span class="material-symbols-outlined fs-5 me-2"
                    >pin_drop</span
                  >
                  <a
                    :href="
                      'https://www.google.com.tw/maps/place/' +
                      item['醫事機構地址']
                    "
                    target="_blank"
                    >{{ item["醫事機構地址"] }}</a
                  >
                </p>
                <p class="mb-2 d-flex align-items-center">
                  <span class="material-symbols-outlined fs-5 me-2">call</span>
                  {{ item["醫事機構電話"] }}
                </p>
                <p class="mb-2 d-flex align-items-center">
                  <span class="material-symbols-outlined fs-5 me-2">
                    description </span
                  >{{ item["備註"] }}
                </p>
                <small class="text-muted"
                  >來源資料時間: {{ item["來源資料時間"] }}</small
                >
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-muted pt-3 text-center">尚無資料</div>
      </div>
      <!-- 地圖 -->
      <div id="map" class="col-lg-8 col-12"></div>
    </div>
    <div class="bg-white"></div>
    <transition name="modal-fade">
      <div class="modal-backdrop" v-if="showModal">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <header class="modal-header">
              <slot class="modal-title" name="header"
                >實名制領取快篩試劑說明</slot
              >
            </header>

            <section class="modal-body text-muted">
              <ol class="mb-0">
                <li>
                  每身分證字號僅能購買 1 次 (可代購)，1 份 5 劑，每劑 100 元，共
                  500 元
                </li>
                <li>身分證尾數單號：每週一、三、五領取</li>
                <li>身分證尾數雙號：每週二、四、六領取</li>
                <li>每週日所有民眾皆可領取</li>
              </ol>
            </section>

            <footer class="modal-footer">
              <button
                type="button"
                class="btn btn-primary rounded-pill text-white px-5"
                @click="showModal = false"
              >
                確定
              </button>
            </footer>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import L from "leaflet";
import cityName from "@/assets/data/city.json";
let osmMap = {};

const iconsConfig = {
  iconSize: [25, 25],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
};
const icons = {
  green: new L.Icon({
    iconUrl: require("@/assets/images/ic-location-green.png"),
    ...iconsConfig,
  }),
  yellow: new L.Icon({
    iconUrl: require("@/assets/images/ic-location-yellow.png"),
    ...iconsConfig,
  }),
  red: new L.Icon({
    iconUrl: require("@/assets/images/ic-location-red.png"),
    ...iconsConfig,
  }),
  currentLocation: new L.Icon({
    iconUrl: require("@/assets/images/ic-current-location.png"),
    ...iconsConfig,
  }),
};

export default {
  name: "App",
  components: {},
  data() {
    return {
      showModal: false,
      userLat: 25.03,
      userLong: 121.55,
      datas: [],
      selectedDatas: [],
      cityName,
      osmMap: {},
      select: {
        city: "請選擇縣市",
        area: "",
      },
    };
  },
  mounted() {
    this.setUserPosition();
    this.initMap();
    this.getDatas();
    this.setUserCityArea();
  },
  methods: {
    initMap() {
      osmMap = L.map("map", {
        center: [this.userLat, this.userLong],
        zoom: 15,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '<a target="_blank" href="https://www.openstreetmap.org/">© OpenStreetMap 貢獻者</a>',
        maxZoom: 18,
      }).addTo(osmMap);
    },
    getDatas() {
      const route =
        "https://data.nhi.gov.tw/Datasets/Download.ashx?rid=A21030000I-D03001-001&l=https://data.nhi.gov.tw/resource/Nhi_Fst/Fstdata.csv";
      this.axios.get(route).then((response) => {
        this.datas = this.convertCSVToJson(response.data);
        this.updateMarker();
      });
    },
    setUserCityArea() {
      const route = `https://api.nlsc.gov.tw/other/TownVillagePointQuery/${this.userLong}/${this.userLat}/4326`;
      this.axios.get(route).then((response) => {
        this.select.city = response.data.ctyName;
        this.select.area = response.data.townName;
        this.updateMarker();
      });
    },
    convertCSVToJson(csv) {
      const lines = csv.split("\n");
      const header = lines[0].split(",");
      const output = lines.slice(1).map((line) => {
        const fields = line.split(",");
        return Object.fromEntries(
          header.map((h, i) => {
            var header = h.includes("備註") ? "備註" : h;
            return [header, fields[i]];
          })
        );
      });
      return output;
    },
    updateCity() {
      this.select.area = "";
      this.updateSelect();
    },
    updateSelect() {
      this.removeMarker();
      this.updateMarker();
    },
    updateMarker() {
      this.selectedDatas = this.filterPharmacyDatas();
      this.selectedDatas.sort(this.compare);
      this.addMapMarker();
    },
    removeMarker() {
      osmMap.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          osmMap.removeLayer(layer);
        }
      });
    },
    filterPharmacyDatas() {
      return this.datas.filter((item) => {
        if (item["醫事機構地址"]) {
          var cityIsValid =
            this.select.city != "請選擇縣市" && this.select.city != "";
          var areaIsValid =
            this.select.area != "請選擇地區" && this.select.area != "";

          if (cityIsValid) {
            const address = item["醫事機構地址"].toString();

            if (address.startsWith(this.select.city)) {
              if (areaIsValid) {
                const addressWithoutCity = address.replace(
                  this.select.city,
                  ""
                );
                if (addressWithoutCity.startsWith(this.select.area)) {
                  return item;
                }
              } else {
                return item;
              }
            }
          }
        }
      });
    },
    addMapMarker() {
      this.selectedDatas.forEach((item, index) => {
        if (item && item["經度"] && item["緯度"]) {
          const longitude = item["經度"].toString();
          const latitude = item["緯度"].toString();
          const num = parseInt(item["快篩試劑截至目前結餘存貨數量"]);

          const template = `<strong>${item["醫事機構名稱"]}</strong><br>
                            快篩試劑剩餘：<strong>${num}</strong><br>
                            地址：<a href="https://www.google.com.tw/maps/place/${item["醫事機構地址"]}" target="_blank">${item["醫事機構地址"]}</a><br>
                            電話: ${item["醫事機構電話"]}<br>
                            備註：${item["備註"]}<br>
                            <small>來源資料時間: ${item["來源資料時間"]}</small>`;

          const icon = this.getMapMarkerIcon(num);

          if (index == 0) {
            L.marker([latitude, longitude], { icon })
              .addTo(osmMap)
              .bindPopup(template)
              .openPopup();
          }
          L.marker([latitude, longitude], { icon })
            .addTo(osmMap)
            .bindPopup(template);
        }
      });
    },
    getMapMarkerIcon(num) {
      var icon = icons.yellow;
      if (num >= 40) {
        icon = icons.green;
      } else if (num <= 15) {
        icon = icons.red;
      }
      return icon;
    },
    compare(prev, next) {
      const prevNum = parseInt(prev["快篩試劑截至目前結餘存貨數量"]);
      const nextNum = parseInt(next["快篩試劑截至目前結餘存貨數量"]);

      if (prevNum < nextNum) {
        return 1;
      }
      if (prevNum > nextNum) {
        return -1;
      }
      return 0;
    },
    setUserPosition() {
      if (navigator.geolocation) {
        var showPosition = (position) => {
          this.userLat = position.coords.latitude;
          this.userLong = position.coords.longitude;
          osmMap.setView([this.userLat, this.userLong], 16);
          const icon = icons.currentLocation;
          L.marker([this.userLat, this.userLong], { icon }).addTo(osmMap);
        };

        var showError = () => alert("抱歉，現在無法取的您的地理位置。");
        navigator.geolocation.getCurrentPosition(showPosition, showError);
      } else {
        alert("抱歉，您的裝置不支援定位功能。");
      }
    },
  },
};
</script>
