import MockAdapter from 'axios-mock-adapter';
import axiosInstance from './axios-instance';

const mock = new MockAdapter(axiosInstance);

export default mock;