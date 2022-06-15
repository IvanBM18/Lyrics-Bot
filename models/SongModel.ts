export default interface ISong {
  id:number,
  title: string,
  url: string,
  song_art_image_url?: string,
  artist_names : string,
  release_date?:string,
  lyrics_state?:string,
  apple_music_id?:string,
}