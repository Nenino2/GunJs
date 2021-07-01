import Gun from 'gun/gun'

declare global {
	interface Window {
		Gun: typeof Gun;
	}
}
export {}