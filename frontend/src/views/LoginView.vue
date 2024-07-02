<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="w-full h-full flex flex-row justify-center items-center text-center">
    <div class="h-full w-1/2 flex flex-col justify-center gap-6 px-[10%]">
      <div class="flex flex-col gap-4">
        <h1 class="text-3xl font-semibold">Sign In</h1>
        <p class="text-lg">Welcome Back! Login to access WSA.</p>
      </div>
      <div class="flex flex-col gap-2">
        <label class="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
            <path
              d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
            />
            <path
              d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
            />
          </svg>
          <input type="text" class="grow" placeholder="Email" />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
            <path
              fill-rule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clip-rule="evenodd"
            />
          </svg>
          <input type="password" class="grow" placeholder="Password" />
        </label>
      </div>
      <button class="btn bg-[#088395] px-10 text-lg">Login</button>
      <p class="text-lg"
        >New here? <span class="text-[#088395]"><RouterLink to="/signup">Sign Up</RouterLink></span></p
      >
    </div>
    <div class="h-full w-1/2">
      <img
        class="object-top object-cover w-full h-full"
        src="https://cdn.pixabay.com/photo/2023/10/07/18/19/clouds-8300738_960_720.jpg"
      />
    </div>
  </div>
</template>
