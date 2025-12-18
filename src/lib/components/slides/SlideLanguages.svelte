<script lang="ts">
  import type { GithubStats } from '$lib/server/github';
  import Chart from '../Chart.svelte';
  import type { EChartsOption } from 'echarts';
  import { theme } from '$lib/theme.svelte';
  import { settings } from '$lib/settings.svelte';
  import * as m from '$lib/paraglide/messages';

  let { stats } = $props<{ stats: GithubStats }>();

  const languageIcons: Record<string, string> = {
    c: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4"><path d="m15.45 15.97l.42 2.44c-.26.14-.68.27-1.24.39c-.57.13-1.24.2-2.01.2c-2.21-.04-3.87-.7-4.98-1.96c-1.14-1.27-1.68-2.88-1.68-4.83C6 9.9 6.68 8.13 8 6.89C9.28 5.64 10.92 5 12.9 5c.75 0 1.4.07 1.94.19s.94.25 1.2.4l-.6 2.49l-1.04-.34c-.4-.1-.87-.15-1.4-.15c-1.15-.01-2.11.36-2.86 1.1c-.76.73-1.14 1.85-1.18 3.34c.01 1.36.37 2.42 1.08 3.2c.71.77 1.7 1.17 2.99 1.18l1.33-.12c.43-.08.79-.19 1.09-.32"/></svg>`,
    'c++': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4"><path d="m10.5 15.97l.41 2.44c-.26.14-.68.27-1.24.39c-.57.13-1.24.2-2.01.2c-2.21-.04-3.87-.7-4.98-1.96Q1 15.135 1 12.21c.05-2.31.72-4.08 2-5.32C4.32 5.64 5.96 5 7.94 5c.75 0 1.4.07 1.94.19s.94.25 1.2.4l-.58 2.49l-1.06-.34c-.4-.1-.86-.15-1.39-.15c-1.16-.01-2.12.36-2.87 1.1c-.76.73-1.15 1.85-1.18 3.34c0 1.36.37 2.42 1.08 3.2c.71.77 1.71 1.17 2.99 1.18l1.33-.12c.43-.08.79-.19 1.1-.32M11 11h2V9h2v2h2v2h-2v2h-2v-2h-2zm7 0h2V9h2v2h2v2h-2v2h-2v-2h-2z"/></svg>`,
    cpp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4"><path d="m10.5 15.97l.41 2.44c-.26.14-.68.27-1.24.39c-.57.13-1.24.2-2.01.2c-2.21-.04-3.87-.7-4.98-1.96Q1 15.135 1 12.21c.05-2.31.72-4.08 2-5.32C4.32 5.64 5.96 5 7.94 5c.75 0 1.4.07 1.94.19s.94.25 1.2.4l-.58 2.49l-1.06-.34c-.4-.1-.86-.15-1.39-.15c-1.16-.01-2.12.36-2.87 1.1c-.76.73-1.15 1.85-1.18 3.34c0 1.36.37 2.42 1.08 3.2c.71.77 1.71 1.17 2.99 1.18l1.33-.12c.43-.08.79-.19 1.1-.32M11 11h2V9h2v2h2v2h-2v2h-2v-2h-2zm7 0h2V9h2v2h2v2h-2v2h-2v-2h-2z"/></svg>`,
    'c#': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4"><path d="m11.5 15.97l.41 2.44c-.26.14-.68.27-1.24.39c-.57.13-1.24.2-2.01.2c-2.21-.04-3.87-.7-4.98-1.96Q2 15.135 2 12.21c.05-2.31.72-4.08 2-5.32C5.32 5.64 6.96 5 8.94 5c.75 0 1.4.07 1.94.19s.94.25 1.2.4l-.58 2.49l-1.06-.34c-.4-.1-.86-.15-1.39-.15c-1.16-.01-2.12.36-2.87 1.1c-.76.73-1.15 1.85-1.18 3.34c0 1.36.37 2.42 1.08 3.2c.71.77 1.71 1.17 2.99 1.18l1.33-.12c.43-.08.79-.19 1.1-.32M13.89 19l.61-4H13l.34-2h1.5l.32-2h-1.5L14 9h1.5l.61-4h2l-.61 4h1l.61-4h2l-.61 4H22l-.34 2h-1.5l-.32 2h1.5L21 15h-1.5l-.61 4h-2l.61-4h-1l-.61 4zm2.95-6h1l.32-2h-1z"/></svg>`,
    csharp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4"><path d="m11.5 15.97l.41 2.44c-.26.14-.68.27-1.24.39c-.57.13-1.24.2-2.01.2c-2.21-.04-3.87-.7-4.98-1.96Q2 15.135 2 12.21c.05-2.31.72-4.08 2-5.32C5.32 5.64 6.96 5 8.94 5c.75 0 1.4.07 1.94.19s.94.25 1.2.4l-.58 2.49l-1.06-.34c-.4-.1-.86-.15-1.39-.15c-1.16-.01-2.12.36-2.87 1.1c-.76.73-1.15 1.85-1.18 3.34c0 1.36.37 2.42 1.08 3.2c.71.77 1.71 1.17 2.99 1.18l1.33-.12c.43-.08.79-.19 1.1-.32M13.89 19l.61-4H13l.34-2h1.5l.32-2h-1.5L14 9h1.5l.61-4h2l-.61 4h1l.61-4h2l-.61 4H22l-.34 2h-1.5l-.32 2h1.5L21 15h-1.5l-.61 4h-2l.61-4h-1l-.61 4zm2.95-6h1l.32-2h-1z"/></svg>`,
    css: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4"><path d="m5 3l-.65 3.34h13.59L17.5 8.5H3.92l-.66 3.33h13.59l-.76 3.81l-5.48 1.81l-4.75-1.81l.33-1.64H2.85l-.79 4l7.85 3l9.05-3l1.2-6.03l.24-1.21L21.94 3z"/></svg>`,
    typescript: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4"><path d="M3 3h18v18H3zm10.71 14.86c.5.98 1.51 1.73 3.09 1.73c1.6 0 2.8-.83 2.8-2.36c0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02c0-.41.31-.73.81-.73c.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33c-1.51 0-2.48.96-2.48 2.23c0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13c0 .48-.45.83-1.15.83c-.83 0-1.31-.43-1.67-1.03zM13 11.25H8v1.5h1.5V20h1.75v-7.25H13z"/></svg>`,
    ts: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4"><path d="M3 3h18v18H3zm10.71 14.86c.5.98 1.51 1.73 3.09 1.73c1.6 0 2.8-.83 2.8-2.36c0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02c0-.41.31-.73.81-.73c.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33c-1.51 0-2.48.96-2.48 2.23c0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13c0 .48-.45.83-1.15.83c-.83 0-1.31-.43-1.67-1.03zM13 11.25H8v1.5h1.5V20h1.75v-7.25H13z"/></svg>`,
    rust: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4"><path d="m21.9 11.7l-.9-.5V11l.7-.7c.1-.1.1-.3 0-.4l-.1-.1l-.9-.3c0-.1 0-.2-.1-.2l.6-.8c.1-.1.1-.3-.1-.4c0 0-.1 0-.1-.1l-1-.2c0-.1-.1-.1-.1-.2l.4-.9v-.3c-.1-.1-.2-.1-.3-.1h-1s0-.1-.1-.1l.2-1c0-.2-.1-.3-.2-.3h-.1l-1 .2c0-.1-.1-.1-.2-.2v-1q0-.3-.3-.3h-.1l-.9.4h-.1L16 3c0-.2-.2-.3-.3-.2h-.1l-.8.6c-.1 0-.2 0-.2-.1l-.3-.9c-.1-.1-.2-.2-.4-.2c0 0-.1 0-.1.1L13 3h-.2l-.5-.8c-.1-.2-.3-.2-.5-.2l-.1.1l-.5.9H11l-.7-.7c-.1-.1-.3-.1-.4 0l-.1.1l-.3.9c-.1 0-.2 0-.2.1l-.8-.6c-.2-.1-.4-.1-.5.1V3l-.2 1s-.1 0-.2.1l-.9-.4c-.1-.1-.3 0-.4.1v1.1c0 .1-.1.1-.1.2l-1-.2c-.2-.1-.3 0-.3.2v.1l.2 1c-.1 0-.1.1-.2.1h-1q-.3 0-.3.3v.1l.4.9v.2L3 8c-.2 0-.3.2-.3.3v.1l.6.8c0 .1 0 .2-.1.2l-.8.4c-.1.1-.2.2-.2.4c0 0 0 .1.1.1l.7.7v.2l-.8.5c-.2.1-.2.3-.2.4l.1.1l.9.6v.2l-.7.7c-.1.1-.1.3 0 .4l.1.1l.9.3c0 .1 0 .2.1.2l-.6.8c-.1.1-.1.3.1.4c0 0 .1 0 .1.1l1 .2c0 .1.1.1.1.2l-.4.9c-.1.1 0 .3.1.4h1.1c.1 0 .1.1.2.1l-.2 1c0 .2.1.3.2.3h.1l1-.2c0 .1.1.1.2.2v1q0 .3.3.3h.1l.9-.4h.1l.2 1c0 .2.2.3.3.2h.1l.8-.6c.1 0 .2 0 .2.1l.3.9c.1.1.2.2.4.2c0 0 .1 0 .1-.1l.8-.7h.2l.5.8c.1.1.3.2.4.1l.1-.1l.5-.8h.2l.7.7c.1.1.3.1.4 0l.1-.1l.3-.9c.1 0 .2 0 .2-.1l.8.6c.1.1.3.1.4-.1c0 0 0-.1.1-.1l.2-1c.1 0 .1-.1.2-.1l.9.4c.1.1.3 0 .4-.1v-1.1l.2-.2l1 .2c.2 0 .3-.1.3-.2v-.1l-.2-1l.2-.2h1q.3 0 .3-.3v-.1l-.4-.9c0-.1.1-.1.1-.2l1-.2c.2 0 .3-.2.2-.3v-.1l-.6-.8l.1-.2l.9-.3c.1-.1.2-.2.2-.4c0 0 0-.1-.1-.1L21 13v-.2l.8-.5c.2-.1.2-.3.1-.6q0 .15 0 0m-5.7 7c-.3-.1-.5-.4-.5-.7c.1-.3.4-.5.7-.5c.3.1.5.4.5.7c0 .4-.3.6-.7.5m-.2-1.9c-.3-.1-.6.1-.6.4l-.4 1.4q-1.35.6-3 .6c-1.1 0-2.1-.2-3.1-.7l-.3-1.4c-.1-.3-.3-.5-.6-.4l-1.2.3c-.2-.2-.4-.5-.6-.7h6c.1 0 .1 0 .1-.1v-2.1c0-.1 0-.1-.1-.1h-1.7v-1.3h1.9c.2 0 .9 0 1.2 1c.1.3.2 1.3.4 1.6c.1.3.6 1 1.1 1h3.1c-.2.3-.4.5-.7.8zm-8.3 1.9c-.3.1-.6-.1-.7-.5c-.1-.3.1-.6.5-.7s.6.1.7.5c0 .3-.2.6-.5.7M5.4 9.5c.1.3 0 .7-.3.8s-.7 0-.8-.3s0-.7.3-.8c.4-.1.7 0 .8.3m-.7 1.6l1.3-.5c.3-.1.4-.4.3-.7L6 9.3h1V14H5c-.3-1-.4-1.9-.3-2.9m5.6-.4V9.3h2.5c.1 0 .9.1.9.7c0 .5-.6.7-1.1.7zm9 1.2v.5h-.8c-.1 0-.1 0-.1.1v.3c0 .8-.5 1-.9 1s-.8-.2-.9-.4c-.2-1.3-.6-1.5-1.2-2c.7-.5 1.5-1.2 1.5-2.1c0-1-.7-1.6-1.1-1.9c-.7-.4-1.4-.5-1.6-.5H6.6c1.1-1.2 2.5-2 4.1-2.3l.9 1c.2.2.5.2.8 0l1-1c2.1.4 3.9 1.7 5 3.6l-.7 1.6c-.1.3 0 .6.3.7l1.3.6zm-7.7-8c.2-.2.6-.2.8 0s.2.6 0 .8q-.45.45-.9 0c-.2-.2-.1-.5.1-.8m6.9 5.6c.1-.3.5-.4.8-.3s.4.5.3.8s-.5.4-.8.3s-.4-.5-.3-.8"/></svg>`,
    swift: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4"><path d="M17.09 19.72c-2.36 1.36-5.59 1.5-8.86.1A13.8 13.8 0 0 1 2 14.5c.67.55 1.46 1 2.3 1.4c3.37 1.57 6.73 1.46 9.1 0c-3.37-2.59-6.24-5.96-8.37-8.71c-.45-.45-.78-1.01-1.12-1.51c8.28 6.05 7.92 7.59 2.41-1.01c4.89 4.94 9.43 7.74 9.43 7.74c.16.09.25.16.36.22c.1-.25.19-.51.26-.78c.79-2.85-.11-6.12-2.08-8.81c4.55 2.75 7.25 7.91 6.12 12.24c-.03.11-.06.22-.05.39c2.24 2.83 1.64 5.78 1.35 5.22c-1.21-2.39-3.48-1.65-4.62-1.17"/></svg>`,
    python: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4"><path d="M19.14 7.5A2.86 2.86 0 0 1 22 10.36v3.78A2.86 2.86 0 0 1 19.14 17H12c0 .39.32.96.71.96H17v1.68a2.86 2.86 0 0 1-2.86 2.86H9.86A2.86 2.86 0 0 1 7 19.64v-3.75a2.85 2.85 0 0 1 2.86-2.85h5.25a2.85 2.85 0 0 0 2.85-2.86V7.5zm-4.28 11.79c-.4 0-.72.3-.72.89s.32.71.72.71a.71.71 0 0 0 .71-.71c0-.59-.32-.89-.71-.89m-10-1.79A2.86 2.86 0 0 1 2 14.64v-3.78A2.86 2.86 0 0 1 4.86 8H12c0-.39-.32-.96-.71-.96H7V5.36A2.86 2.86 0 0 1 9.86 2.5h4.28A2.86 2.86 0 0 1 17 5.36v3.75a2.85 2.85 0 0 1-2.86 2.85H8.89a2.85 2.85 0 0 0-2.85 2.86v2.68zM9.14 5.71c.4 0 .72-.3.72-.89s-.32-.71-.72-.71c-.39 0-.71.12-.71.71s.32.89.71.89"/></svg>`,
    svelte: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Remix Icon by Remix Design - https://github.com/Remix-Design/RemixIcon/blob/master/License --><path fill="currentColor" d="M10.99 1.974c2.92-1.86 6.957-.992 9.001 1.934a6.27 6.27 0 0 1 1.072 4.74a5.9 5.9 0 0 1-.88 2.198c.64 1.221.855 2.62.61 3.977a5.88 5.88 0 0 1-2.657 3.94l-5.127 3.268c-2.92 1.86-6.957.993-9.002-1.933a6.27 6.27 0 0 1-1.07-4.741a5.9 5.9 0 0 1 .88-2.198a6.2 6.2 0 0 1-.611-3.977a5.88 5.88 0 0 1 2.658-3.94zM8.049 20.25c.782.29 1.633.332 2.44.123c.369-.099.72-.253 1.042-.458l5.128-3.267a3.54 3.54 0 0 0 1.598-2.37a3.77 3.77 0 0 0-.645-2.85a4.07 4.07 0 0 0-4.37-1.62c-.369.099-.72.253-1.042.458l-1.957 1.246a1.1 1.1 0 0 1-.314.138a1.227 1.227 0 0 1-1.5-.899a1.1 1.1 0 0 1-.01-.45a1.07 1.07 0 0 1 .48-.713l5.129-3.268a1.1 1.1 0 0 1 .314-.138a1.23 1.23 0 0 1 1.317.489c.157.222.23.492.207.762l-.018.19l.191.058a6.6 6.6 0 0 1 2.005 1.003l.263.192l.096-.295q.078-.235.123-.478a3.77 3.77 0 0 0-.644-2.85a4.07 4.07 0 0 0-4.371-1.621a3.7 3.7 0 0 0-1.042.458L7.34 7.357a3.54 3.54 0 0 0-1.6 2.37a3.77 3.77 0 0 0 .645 2.85a4.07 4.07 0 0 0 4.371 1.62c.369-.099.72-.253 1.042-.457l1.956-1.248q.148-.093.315-.137a1.23 1.23 0 0 1 1.5.899c.034.147.037.3.011.449a1.07 1.07 0 0 1-.482.713l-5.127 3.269a1.1 1.1 0 0 1-.314.137a1.23 1.23 0 0 1-1.317-.488a1.15 1.15 0 0 1-.207-.762l.017-.19l-.19-.058a6.6 6.6 0 0 1-2.005-1.003l-.263-.192l-.096.295a4 4 0 0 0-.123.478a3.77 3.77 0 0 0 .644 2.85a4.07 4.07 0 0 0 1.93 1.498"/></svg>`,
    vue: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><!-- Icon from Famicons by Family - https://github.com/familyjs/famicons/blob/main/LICENSE --><path fill="currentColor" d="m256 144.03l-55.49-96.11h-79.43L256 281.61L390.92 47.92h-79.43z"/><path fill="currentColor" d="M409.4 47.92L256 313.61L102.6 47.92H15.74L256 464.08L496.26 47.92z"/></svg>`,
    java: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 128 128"><!-- Icon from Devicon Plain by konpa - https://github.com/devicons/devicon/blob/master/LICENSE --><path fill="currentColor" d="M47.617 98.12c-19.192 5.362 11.677 16.439 36.115 5.969c-4.003-1.556-6.874-3.351-6.874-3.351c-10.897 2.06-15.952 2.222-25.844 1.092c-8.164-.935-3.397-3.71-3.397-3.71m33.189-10.46c-14.444 2.779-22.787 2.69-33.354 1.6c-8.171-.845-2.822-4.805-2.822-4.805c-21.137 7.016 11.767 14.977 41.309 6.336c-3.14-1.106-5.133-3.131-5.133-3.131m11.319-60.575c.001 0-42.731 10.669-22.323 34.187c6.024 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.793 15.634-29.58m9.998 81.144s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.095.171c-4.45-1.938 3.899-4.625 6.526-5.192c2.739-.593 4.303-.485 4.303-.485c-4.952-3.487-32.013 6.85-13.742 9.815c49.821 8.076 90.817-3.637 77.896-9.468M85 77.896c2.395-1.634 5.703-3.053 5.703-3.053s-9.424 1.685-18.813 2.474c-11.494.964-23.823 1.154-30.012.326c-14.652-1.959 8.033-7.348 8.033-7.348s-8.812-.596-19.644 4.644C17.455 81.134 61.958 83.958 85 77.896m5.609 15.145c-.108.29-.468.616-.468.616c31.273-8.221 19.775-28.979 4.822-23.725c-1.312.464-2 1.543-2 1.543s.829-.334 2.678-.72c7.559-1.575 18.389 10.119-5.032 22.286M64.181 70.069c-4.614-10.429-20.26-19.553.007-35.559C89.459 14.563 76.492 1.587 76.492 1.587c5.23 20.608-18.451 26.833-26.999 39.667c-5.821 8.745 2.857 18.142 14.688 28.815m27.274 51.748c-19.187 3.612-42.854 3.191-56.887.874c0 0 2.874 2.38 17.646 3.331c22.476 1.437 57-.8 57.816-11.436c.001 0-1.57 4.032-18.575 7.231"/></svg>`,
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Akar Icons by Arturo Wibawa - https://github.com/artcoholic/akar-icons/blob/master/LICENSE --><g fill="none"><g fill="currentColor" clip-path="url(#SVGXv8lpc2Y)"><path d="M5.08 0h1.082v1.069h.99V0h1.082v3.236H7.152V2.153h-.99v1.083H5.081zm4.576 1.073h-.952V0h2.987v1.073h-.953v2.163H9.656zM12.165 0h1.128l.694 1.137L14.68 0h1.128v3.236h-1.077V1.632l-.744 1.151h-.019l-.745-1.15v1.603h-1.058zm4.181 0h1.083v2.167h1.52v1.07h-2.603z"/><path fill-rule="evenodd" d="M5.046 22.072L3 4.717h18L18.953 22.07L11.99 24zm4.137-9.5l-.194-2.18h8.145l.19-2.128H6.664l.574 6.437h7.377l-.247 2.76l-2.374.642h-.002l-2.37-.64l-.152-1.697H7.332l.298 3.342l4.36 1.21l4.367-1.21l.532-5.964l.052-.571z" clip-rule="evenodd"/></g><defs><clipPath id="SVGXv8lpc2Y"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath></defs></g></svg>`,
    astro: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Lineicons by Lineicons - https://github.com/LineiconsHQ/Lineicons/blob/main/LICENSE.md --><path fill="currentColor" d="M9.24 19.035c-.901-.826-1.164-2.561-.789-3.819c.65.793 1.552 1.044 2.486 1.186c1.44.218 2.856.137 4.195-.524c.153-.076.295-.177.462-.278c.126.365.159.734.115 1.11c-.107.915-.56 1.622-1.283 2.158c-.289.215-.594.406-.892.608c-.916.622-1.164 1.35-.82 2.41l.034.114a2.4 2.4 0 0 1-1.07-.918a2.6 2.6 0 0 1-.412-1.401c-.003-.248-.003-.497-.036-.74c-.081-.595-.36-.86-.883-.876a1.034 1.034 0 0 0-1.075.843q-.013.058-.033.126M4.1 15.007s2.666-1.303 5.34-1.303l2.016-6.26c.075-.304.296-.51.544-.51c.25 0 .47.206.545.51l2.016 6.26c3.167 0 5.34 1.303 5.34 1.303L15.363 2.602c-.13-.366-.35-.602-.645-.602H9.283c-.296 0-.506.236-.645.602c-.01.024-4.538 12.405-4.538 12.405"/></svg>`,
    js: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Simple Icons by Simple Icons Collaborators - https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md --><path fill="currentColor" d="M0 0h24v24H0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873c-.736-.345-1.554-.585-1.797-1.14c-.091-.33-.105-.51-.046-.705c.15-.646.915-.84 1.515-.66c.39.12.75.42.976.9c1.034-.676 1.034-.676 1.755-1.125c-.27-.42-.404-.601-.586-.78c-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005c-1.14 1.291-.811 3.541.569 4.471c1.365 1.02 3.361 1.244 3.616 2.205c.24 1.17-.87 1.545-1.966 1.41c-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109c1.74 1.756 6.09 1.666 6.871-1.004c.029-.09.24-.705.074-1.65zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805c0 1.232.063 2.363-.138 2.711c-.33.689-1.18.601-1.566.48c-.396-.196-.597-.466-.83-.855c-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517c.855.51 2.004.675 3.207.405c.783-.226 1.458-.691 1.811-1.411c.51-.93.402-2.07.397-3.346c.012-2.054 0-4.109 0-6.179z"/></svg>`,
    javascript: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Simple Icons by Simple Icons Collaborators - https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md --><path fill="currentColor" d="M0 0h24v24H0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873c-.736-.345-1.554-.585-1.797-1.14c-.091-.33-.105-.51-.046-.705c.15-.646.915-.84 1.515-.66c.39.12.75.42.976.9c1.034-.676 1.034-.676 1.755-1.125c-.27-.42-.404-.601-.586-.78c-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005c-1.14 1.291-.811 3.541.569 4.471c1.365 1.02 3.361 1.244 3.616 2.205c.24 1.17-.87 1.545-1.966 1.41c-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109c1.74 1.756 6.09 1.666 6.871-1.004c.029-.09.24-.705.074-1.65zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805c0 1.232.063 2.363-.138 2.711c-.33.689-1.18.601-1.566.48c-.396-.196-.597-.466-.83-.855c-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517c.855.51 2.004.675 3.207.405c.783-.226 1.458-.691 1.811-1.411c.51-.93.402-2.07.397-3.346c.012-2.054 0-4.109 0-6.179z"/></svg>`,
    ruby: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE --><path fill="currentColor" d="M18.8 2.07c2.52.43 3.24 2.16 3.2 3.97V6l-1.14 14.93l-14.78 1.01h.01c-1.23-.05-3.96-.17-4.09-3.99l1.37-2.5l2.77 6.46l2.36-7.62l-.05.01l.02-.02l7.71 2.46l-1.99-7.78l7.35-.46l-5.79-4.74l3.05-1.7zM2 17.91v.02zM6.28 6.23c2.96-2.95 6.79-4.69 8.26-3.2c1.46 1.47-.08 5.09-3.04 8.03c-3 2.94-6.77 4.78-8.24 3.3c-1.47-1.49.04-5.19 3.01-8.13z"/></svg>`,
    go: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Tabler Icons by Paweł Kuna - https://github.com/tabler/tabler-icons/blob/master/LICENSE --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.695 14.305c1.061 1.06 2.953.888 4.226-.384c1.272-1.273 1.444-3.165.384-4.226s-2.953-.888-4.226.384c-1.272 1.273-1.444 3.165-.384 4.226M12.68 9.233c-1.084-.497-2.545-.191-3.591.846c-1.284 1.273-1.457 3.165-.388 4.226c1.07 1.06 2.978.888 4.261-.384A3.67 3.67 0 0 0 14 12h-2.427M5.5 15H4m2-6H4m1 3H2"/></svg>`,
    golang: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Tabler Icons by Paweł Kuna - https://github.com/tabler/tabler-icons/blob/master/LICENSE --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.695 14.305c1.061 1.06 2.953.888 4.226-.384c1.272-1.273 1.444-3.165.384-4.226s-2.953-.888-4.226.384c-1.272 1.273-1.444 3.165-.384 4.226M12.68 9.233c-1.084-.497-2.545-.191-3.591.846c-1.284 1.273-1.457 3.165-.388 4.226c1.07 1.06 2.978.888 4.261-.384A3.67 3.67 0 0 0 14 12h-2.427M5.5 15H4m2-6H4m1 3H2"/></svg>`,
    php: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Akar Icons by Arturo Wibawa - https://github.com/artcoholic/akar-icons/blob/master/LICENSE --><path fill="currentColor" d="M12 5.5C5.271 5.5 0 8.355 0 12s5.271 6.5 12 6.5s12-2.855 12-6.5s-5.271-6.5-12-6.5m-1.246 2h1.31l-.416 2h1.17c.742 0 1.24.104 1.524.363c.277.256.361.676.25 1.248l-.52 2.389H12.74l.479-2.209q.086-.457-.067-.625c-.101-.111-.324-.166-.658-.166h-1.049l-.633 3H9.5zM5 9.5h2.666c1.271 0 2.041.852 1.74 2.123C9.056 13.1 8.12 13.5 6.396 13.5h-.824L5.311 15H3.986zm10.5 0h2.666c1.271 0 2.041.852 1.74 2.123c-.35 1.477-1.287 1.877-3.01 1.877h-.824l-.261 1.5h-1.325zm-9.365 1l-.377 2h.855c.74 0 1.428-.084 1.543-1.187c.043-.428-.135-.813-.99-.813zm10.5 0l-.377 2h.855c.74 0 1.428-.084 1.543-1.187c.043-.428-.134-.813-.99-.813z"/></svg>`
  };

  function getLanguageIcon(name: string): string | null {
    const key = name.trim().toLowerCase();
    if (languageIcons[key]) return languageIcons[key];
    return null;
  }

  function getLanguageMessage(lang: string): string {
    const l = lang.toLowerCase();
    if (
      ['javascript', 'typescript', 'vue', 'svelte', 'html', 'css', 'astro', 'react'].some((k) =>
        l.includes(k)
      )
    ) {
      return 'The web is your canvas, and you paint it with logic and style.';
    }
    if (['python', 'jupyter'].some((k) => l.includes(k))) {
      return 'Data science, AI, or scripts—Python is your snake charmer.';
    }
    if (['java', 'kotlin', 'scala', 'groovy'].some((k) => l.includes(k))) {
      return 'Enterprise grade, robust and scalable. You build systems that last.';
    }
    if (['go', 'golang'].some((k) => l.includes(k))) {
      return 'Simplicity is complicated. You value performance and concurrency.';
    }
    if (['rust'].some((k) => l.includes(k))) {
      return 'Memory safety and blazingly fast. You are rewriting the world.';
    }
    if (['c++', 'c', 'cpp'].some((k) => l === k || l === 'c++')) {
      return 'Close to the metal. You understand how machines truly think.';
    }
    if (['c#', 'csharp', '.net'].some((k) => l.includes(k))) {
      return 'The power of .NET flows through your keyboard.';
    }
    if (['php'].some((k) => l === k)) {
      return 'Powering the web, one request at a time. The classic never dies.';
    }
    if (['ruby'].some((k) => l.includes(k))) {
      return 'Designed for developer happiness. You write code that reads like poetry.';
    }
    if (['swift', 'objective-c'].some((k) => l.includes(k))) {
      return 'Crafting beautiful experiences for the Apple ecosystem.';
    }
    if (['dart', 'flutter'].some((k) => l.includes(k))) {
      return 'Building for every screen with a single codebase.';
    }
    if (['elixir', 'erlang'].some((k) => l.includes(k))) {
      return 'Concurrency is your playground. You build systems that never crash.';
    }
    if (['haskell', 'ocaml', 'f#', 'clojure'].some((k) => l.includes(k))) {
      return 'Functional programming purity. You think in expressions, not statements.';
    }
    if (['shell', 'bash', 'zsh', 'powershell'].some((k) => l.includes(k))) {
      return 'Automating the boring stuff. The terminal is your home.';
    }
    if (['sql', 'plpg'].some((k) => l.includes(k))) {
      return 'Data is the new oil, and you know how to query it.';
    }
    if (['lua'].some((k) => l.includes(k))) {
      return 'Small, fast, and embeddable. Scripting the impossible.';
    }
    if (['perl'].some((k) => l.includes(k))) {
      return "There's more than one way to do it, and you know them all.";
    }
    if (l === 'r') {
      return 'Statistics and visualization. You find truth in data.';
    }
    if (['julia'].some((k) => l.includes(k))) {
      return 'High-performance numerical analysis. Math is your native language.';
    }
    if (['assembly'].some((k) => l.includes(k))) {
      return 'You speak the language of the processor itself. Respect.';
    }

    return 'A polyglot explorer, mastering tools to build the future.';
  }

  let topLangMessage = $derived(
    stats.topLanguages.length > 0 ? getLanguageMessage(stats.topLanguages[0].name) : ''
  );
  const primaryIcon = $derived(
    stats.topLanguages[0] ? getLanguageIcon(stats.topLanguages[0].name) : null
  );
  const secondaryIcon = $derived(
    stats.topLanguages[1] ? getLanguageIcon(stats.topLanguages[1].name) : null
  );

  function getLargeIcon(icon: string) {
    // Remove existing dimensions/classes so we can control it via container
    return icon
      .replace(/class="[^"]*"/g, '')
      .replace(/width="[^"]*"/g, '')
      .replace(/height="[^"]*"/g, '');
  }

  function getLanguagePieOption(
    data: { name: string; count: number; color: string }[]
  ): EChartsOption {
    return {
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          itemStyle: { borderRadius: 8 },
          label: {
            show: true,
            position: 'outside',
            formatter: (params: { dataIndex: number; name: string }) => {
              // Only show label if it's within the top N languages
              return params.dataIndex < settings.languageCount ? params.name : '';
            },
            color: theme.current.chartColors.text
          },
          labelLine: {
            show: true,
            showAbove: true,
            length: 15,
            length2: 10,
            smooth: true
          },
          data: data
            .map((d) => ({
              value: d.count,
              name: d.name,
              itemStyle: { color: d.color },
              labelLine: { show: true } // Ensure lines are potentially shown
            }))
            .map((d, i) => ({
              ...d,
              label: { show: i < settings.languageCount },
              labelLine: { show: i < settings.languageCount }
            }))
        }
      ]
    };
  }

  let chartOptions = $derived(getLanguagePieOption(stats.topLanguages));
</script>

<h3 class="mb-4 text-2xl font-bold">{m.top_languages_title()}</h3>
<div class="relative mb-6 h-64 w-full">
  {#if primaryIcon}
    <div
      class="pointer-events-none absolute -top-30 -left-5 z-0 {theme.current.textPrimary}"
      style="opacity: 0.1; width: 180px; height: 180px;"
      aria-hidden="true"
    >
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html getLargeIcon(primaryIcon)}
    </div>
  {/if}
  {#if secondaryIcon}
    <div
      class="pointer-events-none absolute -top-30 -right-5 z-0 {theme.current.textPrimary}"
      style="opacity: 0.1; width: 180px; height: 180px;"
      aria-hidden="true"
    >
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html getLargeIcon(secondaryIcon)}
    </div>
  {/if}
  <div class="relative z-10 h-full">
    <Chart options={chartOptions} height="100%" />
  </div>
</div>
<div class="flex flex-wrap justify-center gap-2">
  {#each stats.topLanguages.slice(0, settings.languageCount) as lang (lang.name)}
    {#if getLanguageIcon(lang.name)}
      <span
        class="inline-flex items-center gap-1.5 rounded-full border {theme.current.border} {theme
          .current.cardBg} px-3 py-1 text-sm font-medium"
        style="color: {lang.color}"
      >
        <span class="inline-flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden="true">
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html getLanguageIcon(lang.name) || ''}
        </span>
        {lang.name}
      </span>
    {:else}
      <span
        class="rounded-full border {theme.current.border} {theme.current
          .cardBg} px-3 py-1 text-sm font-medium"
        style="color: {lang.color}"
      >
        {lang.name}
      </span>
    {/if}
  {/each}
</div>

{#if topLangMessage}
  <div
    class="mt-8 rounded-lg {theme.current.cardBg} p-4 text-center text-sm italic {theme.current
      .textSecondary} backdrop-blur-sm"
  >
    "{topLangMessage}"
  </div>
{/if}
