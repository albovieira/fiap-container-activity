<template>
  <div id="app">
    <div>
      <form novalidate class="md-layout">
        <md-card class="md-layout-item md-size-100 md-small-size-100">
          <md-card-header>
            <div class="md-title">Cliente</div>
          </md-card-header>

          <md-card-content>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label for="restaurant">Restaurante</label>
                  <md-select
                    name="restaurant"
                    id="restaurant"
                    v-model="formOrder.restaurant"
                    md-dense
                    :disabled="sending"
                  >
                    <md-option></md-option>
                    <md-option value="1">Restaurant 1</md-option>
                    <md-option value="2">Restaurant 2</md-option>
                  </md-select>
                </md-field>
              </div>

              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label for="amount">Valor</label>
                  <md-input
                    name="amount"
                    type="number"
                    id="amount"
                    v-model="formOrder.amount"
                    :disabled="sending"
                  />
                </md-field>
              </div>

              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label for="address">Endereco</label>
                  <md-input
                    name="address"
                    id="address"
                    v-model="formOrder.address"
                    :disabled="sending"
                  />
                </md-field>
              </div>

              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label for="customer">Cliente</label>
                  <md-input
                    name="customer"
                    id="customer"
                    v-model="formOrder.customer"
                    :disabled="sending"
                  />
                </md-field>
              </div>
            </div>
          </md-card-content>

          <md-progress-bar md-mode="indeterminate" v-if="sending" />

          <md-card-actions>
            <md-button
              type="button"
              @click="saveOrder"
              class="md-primary"
              :disabled="sending"
              >Create Order</md-button
            >
          </md-card-actions>
        </md-card>
      </form>
    </div>

    <!-- v-if="ordersPending.length > 0" -->
    <div>
      <hr />
      <h1>Orders</h1>
      <div>
        <h3>Restaurante 1</h3>
        <md-card v-for="item in ordersPending[1]" :key="item.order">
          <md-card-header>
            <div class="md-title">{{ item.order }}</div>
          </md-card-header>

          <md-card-content v-if="item._id">
            {{ item }}
          </md-card-content>

          <md-card-actions>
            <md-button @click="getOrder(item)">Get Order Details</md-button>
          </md-card-actions>
        </md-card>
      </div>

      <div>
        <h3>Restaurante 2</h3>
        <md-card v-for="item in ordersPending[2]" :key="item.order">
          <md-card-header>
            <div class="md-title">{{ item.order }}</div>
          </md-card-header>

          <md-card-content v-if="item._id">
            {{ item }}
          </md-card-content>

          <md-card-actions>
            <md-button @click="getOrder(item)">Get Order Details</md-button>
          </md-card-actions>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import swal from 'sweetalert';
import axios from 'axios';

import * as firebase from 'firebase';

console.log(process.env);
const app = firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_APIKEY,
  authDomain: process.env.VUE_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_URL,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE,
});
const request = axios.create({
  baseURL: process.env.VUE_APP_ORDER_API,
});

export default {
  name: 'App',
  components: {},
  data() {
    return {
      sending: false,
      ordersPending: [],
      details: {},
      formOrder: {
        restaurant: null,
        amount: null,
        address: null,
        customer: null,
      },
    };
  },
  created() {
    this.getFirebaseOrders(1);
    this.getFirebaseOrders(2);
  },
  methods: {
    async saveOrder() {
      console.log('form', this.formOrder);
      if (
        !this.formOrder.restaurant ||
        !this.formOrder.amount ||
        !this.formOrder.address ||
        !this.formOrder.customer
      ) {
        swal('Error!', 'Invalid fields', 'error');
        return;
      }

      if (this.formOrder.amount < 0) {
        swal('Error!', 'Invalid fields', 'error');
        return;
      }

      const { status } = await request.post('/orders', this.formOrder);
      if (status === 201) {
        swal('Good job!', 'Order created!', 'success');
        this.formOrder = {
          restaurant: null,
          amount: null,
          address: null,
          customer: null,
        };
      }
    },
    async getOrder(item) {
      const { data } = await request.get(`/orders/${item.order}`);
      item = Object.assign(item, data);
      this.item = item;
      console.log(item);

      this.$forceUpdate();
      return item;
    },
    showPendingOrders(restauranteId, orders) {
      if (orders) {
        this.ordersPending[restauranteId] =
          Object.keys(orders).map((k) => {
            return orders[k];
          }) || [];

        this.$forceUpdate();
      }
    },
    getFirebaseOrders(restauranteId) {
      const database = app.database();
      const orders = database.ref('restaurants/' + restauranteId);
      orders.on('value', (snapshot) => {
        this.showPendingOrders(restauranteId, snapshot.val());
      });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
